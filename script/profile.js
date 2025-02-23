// Import Firebase instances from firebase.js
import { auth, db } from "../script/firebase.js"; 
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { doc, getDoc, collection, query, where, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";


console.log("profile.js is loaded");

async function loadUserProfile(user) {
    if (!user) {
        alert("You must be logged in to view your profile.");
        // Redirect to login page
        window.location.href = "login.html";
        return;
    }

    try {
        
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

        // Fetch totalPoints from spinTheWheel collection
        const spinDocRef = doc(db, "spinTheWheel", user.uid); 
        const spinDocSnap = await getDoc(spinDocRef);

        if (spinDocSnap.exists()) {
            const spinData = spinDocSnap.data();

            // Update points display
            const totalPoints = Number(spinData.totalPoints) || 0; 
            console.log("Fetched totalPoints: ", totalPoints); 
            // Show totalPoints
            document.getElementById("user-points").textContent = totalPoints; 
        } else {
            console.error("Spin the Wheel data not found for this user.");
            alert("Spin data not found. Please try again.");
        }
    } catch (error) {
        console.error("Error loading profile:", error);
    }
}



async function loadUserListings(user) {
    const userListingsGrid = document.getElementById("user-listings");
    // Clear existing listings
    userListingsGrid.innerHTML = ""; 

    try {
        const q = query(collection(db, "listings"), where("createdBy.uid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            userListingsGrid.innerHTML = "<p>You have no listings yet.</p>";
            return;
        }

        querySnapshot.forEach((docSnap) => {
            const listing = docSnap.data();
            const listingId = docSnap.id;

            const productCard = document.createElement("div");
            productCard.classList.add("product-card");

            productCard.innerHTML = `
                <img src="${listing.image}" alt="Product Image" class="product-image">
                <div class="product-info">
                    <h4 class="product-title">${listing.name}</h4>
                    <p class="product-price">${listing.price}</p>
                    <p class="product-description">${listing.description}</p>
                    <button class="btn delete-btn" data-id="${listingId}">Delete</button>
                </div>
            `;

            // Add delete functionality
            productCard.querySelector(".delete-btn").addEventListener("click", async (e) => {
                if (confirm(`Are you sure you want to delete "${listing.name}"?`)) {
                    await deleteListing(listingId);
                    // Refresh listings
                    loadUserListings(user); 
                }
            });

            userListingsGrid.appendChild(productCard);
        });

    } catch (error) {
        console.error("Error fetching user listings:", error);
    }
}

async function deleteListing(listingId) {
    try {
        await deleteDoc(doc(db, "listings", listingId));
        alert("Listing deleted successfully.");
    } catch (error) {
        console.error("Error deleting listing:", error);
        alert("Failed to delete listing. Please try again.");
    }
}


onAuthStateChanged(auth, (user) => {
    if (user) {
        loadUserProfile(user);
        loadUserListings(user);
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    menuToggle.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });
});
