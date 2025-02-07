// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to Load User Profile Data
async function loadUserProfile(user) {
    if (!user) {
        alert("You must be logged in to view your profile.");
        window.location.href = "login.html"; // Redirect if user not logged in
        return;
    }

    try {
        // Fetch user profile from Firestore
        const userDocRef = doc(db, "register", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            
            // Update HTML with user info
            document.getElementById("profile-name").textContent = userData.username || "No Username";
            document.getElementById("profile-email").textContent = user.email;
            document.getElementById("profile-bio").textContent = userData.bio || "No bio available.";
        } else {
            console.error("User profile not found in Firestore.");
            alert("Profile not found. Please complete your profile.");
        }
    } catch (error) {
        console.error("Error loading profile:", error);
    }
}

// Check if user is logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadUserProfile(user);
    }
});
