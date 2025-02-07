// Import Firebase instances
import { auth, db } from "../script/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

console.log("edit-profile.js loaded");

// ✅ Function to Load User Data into the Form
async function loadUserData(user) {
    if (!user) {
        alert("You must be logged in to edit your profile.");
        window.location.href = "login.html"; // Redirect if not logged in
        return;
    }

    try {
        const userDocRef = doc(db, "register", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();

            // Populate form fields
            document.getElementById("editUsername").value = userData.username || "";
            document.getElementById("editBio").value = userData.bio || "";
        } else {
            console.error("User profile not found in Firestore.");
            alert("Profile not found. Please complete your profile.");
        }
    } catch (error) {
        console.error("Error loading profile:", error);
    }
}

// ✅ Function to Save Updated User Data
async function saveUserData(user) {
    const newUsername = document.getElementById("editUsername").value.trim();
    const newBio = document.getElementById("editBio").value.trim();

    if (!newUsername) {
        alert("Username cannot be empty.");
        return;
    }

    try {
        const userDocRef = doc(db, "register", user.uid);

        await updateDoc(userDocRef, {
            username: newUsername,
            bio: newBio
        });

        alert("Profile updated successfully!");
        window.location.href = "profile.html"; // Redirect to profile page
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Error updating profile. Please try again.");
    }
}

// ✅ Handle Auth State & Load User Data
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadUserData(user);

        // Attach event listener for save button
        document.getElementById("saveProfileBtn").addEventListener("click", () => saveUserData(user));
    } else {
        alert("You must be logged in.");
        window.location.href = "login.html";
    }
});

// ✅ Handle Cancel Button
document.getElementById("cancelEditBtn").addEventListener("click", () => {
    window.location.href = "profile.html"; // Redirect back to profile
});
