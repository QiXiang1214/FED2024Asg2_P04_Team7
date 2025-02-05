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

// DOM Elements
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const fileInput = document.getElementById('fileInput');
const userSearch = document.getElementById('userSearch');
const messagesContainer = document.getElementById('messagesContainer');
const chatList = document.getElementById('chatList');

// Global Variables
let currentUser = null;
let selectedUserId = null;
let selectedUserElement = null;

// Initialize Chat
auth.onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        loadUsers();
        setupEventListeners();
        
        // Automatically select the first user if no user is selected
        if (!selectedUserId && chatList.children.length > 0) {
            const firstUser = chatList.children[0];
            firstUser.click();
        }
    } else {
        window.location.href = '/login.html'; // Redirect if not logged in
    }
});

// Function to format dates in dd/mm/yyyy and HH:MM AM/PM format
const formatSGTDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
};

// Load Users
async function loadUsers(searchTerm = "") {
    const usersSnapshot = await db.collection('users').get();
    chatList.innerHTML = '';

    usersSnapshot.forEach(doc => {
        const user = doc.data();
        if (user.uid !== currentUser.uid) {
            if (user.email.toLowerCase().includes(searchTerm.toLowerCase())) {
                const userElement = document.createElement('div');
                userElement.className = 'chat-user';
                userElement.dataset.userId = user.uid; // Add user ID to dataset
                userElement.innerHTML = `
                    <div class="user-info">
                        <div class="user-email">${user.email}</div>
                    </div>
                `;

                userElement.addEventListener('click', () => {
                    // Remove selection from previously selected user
                    if (selectedUserElement) {
                        selectedUserElement.classList.remove('selected');
                    }
                    
                    // Set new selection
                    selectedUserElement = userElement;
                    selectedUserId = user.uid;
                    userElement.classList.add('selected');
                    
                    // Load messages for this user
                    loadMessages(user.uid);
                });

                chatList.appendChild(userElement);
            }
        }
    });
}

// Listen for search input
userSearch.addEventListener('input', (e) => {
    loadUsers(e.target.value);
});

// Send Message
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
    if (!selectedUserId) return alert('Please select a user to chat with.');

    const message = messageInput.value.trim();
    const file = fileInput.files[0];
    if (!message && !file) return;

    try {
        let imageUrl = '';
        if (file) {
            const storageRef = storage.ref(`chat_images/${currentUser.uid}/${Date.now()}_${file.name}`);
            await storageRef.put(file);
            imageUrl = await storageRef.getDownloadURL();
        }

        const now = new Date();
        const formattedNow = formatSGTDate(now);

        await db.collection('messages').add({
            text: message,
            imageUrl,
            senderId: currentUser.uid,
            receiverId: selectedUserId,
            participants: [currentUser.uid, selectedUserId],  // New field
            timestamp: firebase.firestore.FieldValue.serverTimestamp() 
        });

        messageInput.value = '';
        fileInput.value = '';
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

// Add loading indicator to messages container
function showLoading() {
    messagesContainer.innerHTML = '<div class="loading">Loading messages...</div>';
}

let unsubscribeMessages1 = null;
let unsubscribeMessages2 = null;

function loadMessages(targetUserId) {
    if (!targetUserId) {
        messagesContainer.innerHTML = '<div class="no-user-selected">Select a user to start chatting</div>';
        return;
    }

    showLoading();

    // Clear previous listeners
    if (unsubscribeMessages1) unsubscribeMessages1();

    let allMessages = [];

    // Use a single query with 'array-contains-any' to get all messages between two users
    unsubscribeMessages1 = db.collection('messages')
        .where('participants', 'array-contains-any', [currentUser.uid, targetUserId]) // New query using 'array-contains-any'
        .orderBy('timestamp', 'asc')
        .onSnapshot(snapshot => {
            allMessages = snapshot.docs;
            displayMessages(allMessages);
        });
}


function displayMessages(messages) {
    // Remove duplicates
    const uniqueMessages = messages.filter((v, i, a) => 
        a.findIndex(t => (t.id === v.id)) === i
    );

    // Sort by timestamp
    uniqueMessages.sort((a, b) => 
        a.data().timestamp?.toMillis() - b.data().timestamp?.toMillis()
    );

    // Display messages
    messagesContainer.innerHTML = '';
    uniqueMessages.forEach(doc => {
        const message = doc.data();
        const isCurrentUser = message.senderId === currentUser.uid;
        const timestamp = message.timestamp?.toDate() || new Date();

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isCurrentUser ? 'self' : ''}`;

        let content = '';
        if (message.imageUrl) {
            content += `<img src="${message.imageUrl}" class="message-image">`;
        }
        if (message.text) {
            content += `<div class="message-text">${message.text}</div>`;
        }
        content += `<div class="message-info">${formatSGTDate(timestamp)}</div>`;

        messageDiv.innerHTML = content;
        messagesContainer.appendChild(messageDiv);
    });

    // Auto-scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}



function processMessages(messages) {
    // Remove duplicates
    const uniqueMessages = messages.filter((v, i, a) => 
        a.findIndex(t => (t.id === v.id)) === i
    );
    
    // Sort by timestamp
    uniqueMessages.sort((a, b) => 
        a.data().timestamp?.toMillis() - b.data().timestamp?.toMillis()
    );

    // Display messages
    messagesContainer.innerHTML = '';
    uniqueMessages.forEach(doc => {
        const message = doc.data();
        const isCurrentUser = message.senderId === currentUser.uid;
        const timestamp = message.timestamp?.toDate();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isCurrentUser ? 'self' : ''}`;
        
        let content = '';
        if (message.imageUrl) {
            content += `<img src="${message.imageUrl}" class="message-image">`;
        }
        if (message.text) {
            content += `<div class="message-text">${message.text}</div>`;
        }
        content += `<div class="message-info">${formatSGTDate(timestamp)}</div>`;
        
        messageDiv.innerHTML = content;
        messagesContainer.appendChild(messageDiv);
    });

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Update the file input handler
fileInput.addEventListener('change', (e) => {
    if (e.target.files[0]) {
        // Preview image or enable send button
        sendBtn.disabled = false;
    }
});

// Modify send button handler to clear file after send
sendBtn.addEventListener('click', () => {
    sendMessage();
    fileInput.value = '';
});

// Event Listeners
function setupEventListeners() {
    fileInput.addEventListener('change', () => {
        if (fileInput.files[0]) sendMessage();
    });
}