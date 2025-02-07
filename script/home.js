// Import necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, where } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

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
const db = getFirestore(app);

// Function to Fetch and Display Listings
async function fetchListings(category = null) {
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = ""; // Clear existing products

    try {
        let q;

        if (category) {
            q = query(collection(db, "listings"), where("category", "==", category), orderBy("createdAt", "desc"));
        } else {
            q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
        }

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            productGrid.innerHTML = "<p>No listings available in this category.</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const listing = doc.data();
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            productCard.innerHTML = `
                <img src="${listing.image}" alt="Product Image" class="product-image" onerror="this.src='default-image.jpg';">
                <div class="product-info">
                    <h4 class="product-title">${listing.name}</h4>
                    <p class="product-price">${listing.price}</p>
                    <p class="product-description">${listing.description}</p>
                    <button class="btn">Add to Cart</button>
                </div>
            `;
            productGrid.appendChild(productCard);
        });

    } catch (error) {
        console.error("Error fetching listings:", error);
    }
}

// ✅ Ensure Firestore Loads Listings on Page Load
document.addEventListener('DOMContentLoaded', () => {
    fetchListings(); // Load all listings initially

    // Select all category buttons and add event listeners
    document.querySelectorAll('.category-item').forEach(button => {
        button.addEventListener('click', () => {
            const selectedCategory = button.dataset.category;
            fetchListings(selectedCategory); // Fetch filtered listings based on category
        });
    });
});
