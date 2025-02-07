// Import Firebase instances from firebase.js
import { auth, db } from "../script/firebase.js"; 
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

console.log("profile.js is loaded");

// ✅ Function to Load User Profile Data
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

            // ✅ Update HTML with user info
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

// ✅ Check if user is logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadUserProfile(user);
    }
});
