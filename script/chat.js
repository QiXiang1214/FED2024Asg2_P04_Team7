// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCeZEByafoJgLvZDxc0DCuUIYL2_37XT2c",
    authDomain: "fed-assignment-2-54ec3.firebaseapp.com",
    projectId: "fed-assignment-2-54ec3",
    storageBucket: "fed-assignment-2-54ec3.firebasestorage.app",
    messagingSenderId: "398158834633",
    appId: "1:398158834633:web:c025708b57da0f4e109618",
    measurementId: "G-HC6YLQLFK5"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// DOM Elements
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const fileInput = document.getElementById('fileInput');
const userSearch = document.getElementById('userSearch');
const messagesContainer = document.getElementById('messagesContainer');

// Global Variables
let selectedUserId = null;

// Message Handling
sendBtn.addEventListener('click', async () => {
    const message = messageInput.value.trim();
    const file = fileInput.files[0];

    if (message || file) {
        let imageUrl = '';

        if (file) {
            const storageRef = storage.ref(`images/${Date.now()}_${file.name}`);
            await storageRef.put(file);
            imageUrl = await storageRef.getDownloadURL();
        }

        await db.collection('messages').add({
            text: message,
            imageUrl,
            senderId: "anonymous",
            receiverId: selectedUserId,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        messageInput.value = '';
        fileInput.value = '';
    }
});

// User Search
userSearch.addEventListener('input', async (e) => {
    const searchQuery = e.target.value.toLowerCase();
    if (searchQuery) {
        const snapshot = await db.collection('users')
            .where('email', '>=', searchQuery)
            .where('email', '<=', searchQuery + '\uf8ff')
            .get();

        const chatList = document.getElementById('chatList');
        chatList.innerHTML = '';

        snapshot.forEach(doc => {
            const user = doc.data();
            const userElement = document.createElement('div');
            userElement.textContent = user.email;
            userElement.className = 'chat-user';
            userElement.addEventListener('click', () => {
                selectedUserId = user.uid;
                loadMessages(user.uid);
            });
            chatList.appendChild(userElement);
        });
    }
});

// Load Messages
async function loadMessages(userId) {
    const messages = await db.collection('messages')
        .where('receiverId', '==', userId)
        .orderBy('timestamp', 'asc')
        .get();

    messagesContainer.innerHTML = '';
    messages.forEach(doc => displayMessage(doc.data()));
}

// Display Message
function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    
    if (message.imageUrl) {
        messageElement.innerHTML = `<img src="${message.imageUrl}" style="max-width: 200px; border-radius: 8px;">`;
    } else {
        messageElement.textContent = message.text;
    }

    messagesContainer.appendChild(messageElement);
}
