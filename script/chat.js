// Firebase Initialization
const firebaseConfig = {
    apiKey: "AIzaSyCeZEByafoJgLvZDxc0DCuUIYL2_37XT2c",
    authDomain: "fed-assignment-2-54ec3.firebaseapp.com",
    projectId: "fed-assignment-2-54ec3",
    storageBucket: "fed-assignment-2-54ec3.appspot.com",
    messagingSenderId: "398158834633",
    appId: "1:398158834633:web:c025708b57da0f4e109618",
    measurementId: "G-HC6YLQLFK5"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

function generateThreadId(userId1, userId2) {
    return [userId1, userId2].sort().join('_');
}

// DOM Elements
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const fileInput = document.getElementById('fileInput');
const userSearch = document.getElementById('userSearch');
const messagesContainer = document.getElementById('messagesContainer');
const chatList = document.getElementById('chatList');
const imageOverlay = document.getElementById('imageOverlay');

// Global Variables
let currentUser = null;
let selectedUserId = null;
let selectedUserElement = null;

// Initialize Chat
auth.onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        const urlParams = new URLSearchParams(window.location.search);
        const sellerUsername = urlParams.get('seller');

        // Set search input if seller parameter exists
        if (sellerUsername) {
            userSearch.value = decodeURIComponent(sellerUsername);
        }

        loadUsers(sellerUsername ? decodeURIComponent(sellerUsername) : "");
        setupEventListeners();
        setupThreadListeners();

        // Automatically select the first user if no user is selected
        if (!selectedUserId && chatList.children.length > 0) {
            const firstUser = chatList.children[0];
            firstUser.click();
        }
    } else {
        window.location.href = '/login.html';
    }
});

// Cleanup on logout
function cleanup() {
    if (unsubscribeMessages) unsubscribeMessages();
    if (threadUnsubscribe) threadUnsubscribe();
}

// Call cleanup when leaving the page
window.addEventListener('beforeunload', cleanup);

const formatSGTDate = (date) => {
    if (!date) return "";  

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
};

// Load Users
async function loadUsers(searchTerm = "") {
    const usersSnapshot = await db.collection('register').get();
    chatList.innerHTML = '';

    usersSnapshot.forEach(doc => {
        const user = doc.data();
        if (user.uid !== currentUser.uid) {
            if (user.username.toLowerCase().includes(searchTerm.toLowerCase())) {
                const userElement = document.createElement('div');
                userElement.className = 'chat-user';
                userElement.dataset.userId = user.uid;
                userElement.innerHTML = `
                    <div class="user-info">
                        <div class="user-username">${user.username}</div>
                    </div>`;
                
                if (user.uid === selectedUserId) {
                    userElement.classList.add('selected');
                    selectedUserElement = userElement;
                }

                chatList.appendChild(userElement);
            }
        }
    });
}

// Listen for search input
userSearch.addEventListener('input', (e) => {
    loadUsers(e.target.value);
    if (window.innerWidth <= 768) {
        document.querySelector('.sidebar').classList.add('expanded');
    }
});

// Send Message
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); 
        sendMessage();
    }
});

// Create in Cloudinary settings
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dhgrd42d5/upload";
const uploadPreset = "Chatpics"; 

async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
        const response = await fetch(CLOUDINARY_URL, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (response.ok) {
            return data.secure_url;  
        } else {
            console.error("Cloudinary Upload Error:", data.error);
            alert('Upload failed: ' + data.error.message);  
            return null;
        }
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        alert('Error uploading file: ' + error.message);
        return null;
    }
}

async function sendMessage() {
    if (!selectedUserId) return alert('Please select a user to chat with.');

    const message = messageInput.value.trim();
    const file = fileInput.files[0];
    let imageUrl = '';

    if (file) {
        imageUrl = await uploadToCloudinary(file);
    }

    if (!message && !imageUrl) return;

    try {
        const threadId = generateThreadId(currentUser.uid, selectedUserId);
        const now = new Date();
        const timestamp = firebase.firestore.Timestamp.fromDate(now);

        const newMessage = {
            text: message,
            imageUrl,
            senderId: currentUser.uid,
            receiverId: selectedUserId,
            timestamp: timestamp,
        };

        // Update document with arrayUnion
        await db.collection('chats').doc(threadId).set({
            participants: [currentUser.uid, selectedUserId],
            lastMessage: message || 'Image',
            lastMessageTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });

        // Add message to array
        await db.collection('chats').doc(threadId).update({
            messages: firebase.firestore.FieldValue.arrayUnion(newMessage)
        });

        messageInput.value = '';
        fileInput.value = '';
    } catch (error) {
        console.error('Error sending message:', error);
    }

    if (threadUnsubscribe) threadUnsubscribe();
    setupThreadListeners();
}

// Add loading indicator to messages container
function showLoading() {
    messagesContainer.innerHTML = '<div class="loading">Loading messages...</div>';
}

let unsubscribeMessages = null;

async function loadMessages(targetUserId) {
    if (!targetUserId) {
        messagesContainer.innerHTML = '<div class="no-user-selected">Select a user to start chatting</div>';
        return;
    }

    showLoading();

    // Ensure threadId is properly initialized
    const threadId = generateThreadId(currentUser.uid, targetUserId);

    try {
        // Update last read time when opening chat
        await db.collection('chats').doc(threadId).update({
            [`lastRead.${currentUser.uid}`]: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Clear previous listener
        if (unsubscribeMessages) unsubscribeMessages();

        // Listen to document changes
        unsubscribeMessages = db.collection('chats').doc(threadId)
            .onSnapshot(doc => {
                const data = doc.data();
                const messages = data?.messages || [];
                displayMessages(messages);
            });
    } catch (error) {
        console.error('Error loading messages:', error);
        messagesContainer.innerHTML = '<div class="error">Failed to load messages. Please try again.</div>';
    }
}

function displayMessages(messages) {
    messagesContainer.innerHTML = '';
    messages.forEach(message => {
        const isCurrentUser = message.senderId === currentUser.uid;
        const timestamp = message.timestamp ? message.timestamp.toDate() : null;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isCurrentUser ? 'self' : ''}`;

        let content = '';
        if (message.imageUrl) {
            content += `<img src="${message.imageUrl}" class="message-image">`;
        }
        if (message.text) {
            content += `<div class="message-text">${message.text}</div>`;
        }

        if (timestamp) {
            content += `<div class="message-info">${formatSGTDate(timestamp)}</div>`;
        }

        messageDiv.innerHTML = content;
        messagesContainer.appendChild(messageDiv);
    });

    setupImageClickHandler(document.querySelectorAll('.message-image'));
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Modify image click handler
function setupImageClickHandler(images) {
    images.forEach(image => {
        image.addEventListener('click', (e) => {
            e.stopPropagation();
            const clonedImage = image.cloneNode();
            clonedImage.classList.remove('message-image');
            imageOverlay.innerHTML = '';
            imageOverlay.appendChild(clonedImage);
            imageOverlay.classList.add('active');
            
            // Add loaded class when image is loaded
            clonedImage.onload = () => {
                clonedImage.classList.add('loaded');
            };
        });
    });
}

// Close overlay when clicking anywhere on the screen (including the image itself)
imageOverlay.addEventListener('click', (e) => {
    imageOverlay.classList.remove('active');
});

// File Input handler and Send Button handler
fileInput.addEventListener('change', (e) => {
    if (e.target.files[0]) {
        sendBtn.disabled = false;  
    }
});

// Prevent file input from sending the message automatically
fileInput.addEventListener('change', (e) => {
    if (e.target.files[0]) {
        sendBtn.disabled = false;  
    }
});

// Add to chat.js
let threadUnsubscribe = null;

function setupThreadListeners() {
    threadUnsubscribe = db.collection('chats')
        .where('participants', 'array-contains', currentUser.uid)
        .onSnapshot(snapshot => {
            snapshot.forEach(doc => {
                const thread = doc.data();
                const otherUserId = thread.participants.find(id => id !== currentUser.uid);
                const lastRead = thread.lastRead?.[currentUser.uid]?.toDate();
                const lastMessage = thread.messages?.[thread.messages.length - 1];
                const lastMessageTime = lastMessage?.timestamp?.toDate();

                const hasUnread = lastMessageTime > lastRead;
                // Handle unread messages if needed
                if (hasUnread) {
                }
            });
        });
}

// Toggle chat list visibility
function toggleChatList() {
    const chatList = document.querySelector('.chat-list');
    const searchBar = document.querySelector('.search-bar');
    chatList.style.display = chatList.style.display === 'block' ? 'none' : 'block';
    searchBar.classList.toggle('active');
}

// Close chat list when a user is selected
document.querySelectorAll('.chat-user').forEach(user => {
    user.addEventListener('click', () => {
        document.querySelector('.chat-list').style.display = 'none';
        document.querySelector('.search-bar').classList.remove('active');
    });
});

function setupEventListeners() {
    const sidebar = document.querySelector('.sidebar');
    const searchBar = document.querySelector('.search-bar');
    const chatList = document.querySelector('.chat-list');
    
    // Toggle sidebar expansion when clicking search bar on mobile
    searchBar.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            e.stopPropagation();
            sidebar.classList.toggle('expanded');
        }
    });

    // Update user selection handler
    document.addEventListener('click', function(e) {
        const chatUser = e.target.closest('.chat-user');
        if (chatUser) {
            if (selectedUserElement) {
                selectedUserElement.classList.remove('selected');
            }
            selectedUserElement = chatUser;
            selectedUserId = chatUser.dataset.userId;
            chatUser.classList.add('selected');
            loadMessages(selectedUserId);

            // Close sidebar on mobile after selection
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('expanded');
            }
        } else if (window.innerWidth <= 768 && !sidebar.contains(e.target)) {
            // Close sidebar when clicking outside on mobile
            sidebar.classList.remove('expanded');
        }
    });

    // Prevent search input from closing sidebar
    searchBar.querySelector('input').addEventListener('click', function(e) {
        e.stopPropagation();
        if (window.innerWidth <= 768) {
            sidebar.classList.add('expanded');
        }
    });

    // Update search functionality
    userSearch.addEventListener('input', (e) => {
        loadUsers(e.target.value);
        if (window.innerWidth <= 768) {
            sidebar.classList.add('expanded');
        }
    });
}
//Toggle Menu
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    menuToggle.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });
});