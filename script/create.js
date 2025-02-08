// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCeZEByafoJgLvZDxc0DCuUIYL2_37XT2c",
  authDomain: "fed-assignment-2-54ec3.firebaseapp.com",
  projectId: "fed-assignment-2-54ec3",
  storageBucket: "fed-assignment-2-54ec3.appspot.com",
  messagingSenderId: "398158834633",
  appId: "1:398158834633:web:c025708b57da0f4e109618",
  measurementId: "G-HC6YLQLFK5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Check if user is logged in before accessing create.html
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        alert("You must be logged in to create a listing!");
        window.location.href = "login.html"; // Redirect to login page
        return;
    }

    // ✅ Get Username from Firestore (Now looking in "register" instead of "users")
    const userDocRef = doc(db, "register", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
        alert("User profile not found. Please complete your profile.");
        return;
    }

    const username = userDocSnap.data().username;

    // ✅ Form submission event listener
    document.getElementById('listingForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const productName = document.getElementById('productName').value;
        const productPrice = document.getElementById('productPrice').value;
        const productCategory = document.getElementById('productCategory').value;
        const productDescription = document.getElementById('productDescription').value;
        const productImageInput = document.getElementById('productImage');
        const productImage = productImageInput.files[0];

        if (!productImage) {
            alert("Please upload an image!");
            return;
        }

        // ✅ Image format validation
        const allowedFormats = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
        if (!allowedFormats.includes(productImage.type)) {
            alert("Invalid file type! Please upload a JPG, PNG, or GIF image.");
            return;
        }

        console.log("Uploading Image to Cloudinary...");

        // ✅ Cloudinary Upload Configuration
        const cloudinaryUploadUrl = "https://api.cloudinary.com/v1_1/dg9bfkn5e/image/upload"; // Replace with your Cloudinary cloud name
        const formData = new FormData();
        formData.append("file", productImage);
        formData.append("upload_preset", "fed_assignment_upload"); // Replace with your Upload Preset name

        try {
            const response = await fetch(cloudinaryUploadUrl, {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (!data.secure_url) {
                throw new Error("Image upload failed.");
            }

            const imageUrl = data.secure_url; // Get the Cloudinary image URL

            console.log("Image Uploaded! URL:", imageUrl);

            // ✅ Save listing to Firestore with `uid` and `username`
            await addDoc(collection(db, "listings"), {
                name: productName,
                price: `$${parseFloat(productPrice).toFixed(2)}`,
                category: productCategory,
                description: productDescription,
                image: imageUrl, // Cloudinary image URL
                createdBy: {
                    uid: user.uid, // Store UID
                    username: username // Store username from "register"
                },
                createdAt: serverTimestamp() // Store timestamp
            });

            alert('Listing Created Successfully!');
            window.location.href = 'home.html'; // Redirect to home page

        } catch (error) {
            console.error("Error saving listing:", error);
            alert("Error creating listing. Please try again.");
        }
    });
});
//Toggle Menu
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    menuToggle.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });
});
