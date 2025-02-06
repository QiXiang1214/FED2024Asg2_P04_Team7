// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-storage.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCeZEByafoJgLvZDxc0DCuUIYL2_37XT2c",
  authDomain: "fed-assignment-2-54ec3.firebaseapp.com",
  projectId: "fed-assignment-2-54ec3",
  storageBucket: "fed-assignment-2-54ec3.appspot.com", //  Ensure this is correct
  messagingSenderId: "398158834633",
  appId: "1:398158834633:web:c025708b57da0f4e109618",
  measurementId: "G-HC6YLQLFK5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

//  Ensure user is logged in before allowing upload
onAuthStateChanged(auth, (user) => {
    if (!user) {
        alert("Please log in to create a listing.");
        window.location.href = "login.html"; // Redirect to login page if not authenticated
    }
});

//  Event Listener for Form Submission
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

    console.log("Uploading Image...");

    try {
        //  Check if user is logged in before uploading
        const user = auth.currentUser;
        if (!user) {
            alert("You must be logged in to upload images.");
            return;
        }

        //  Create a unique filename
        const imageRef = ref(storage, `listings/${Date.now()}_${productImage.name}`);
        
        //  Upload file to Firebase Storage
        const uploadSnapshot = await uploadBytes(imageRef, productImage);
        console.log("Upload Successful:", uploadSnapshot);

        //  Get the correct download URL
        const downloadURL = await getDownloadURL(imageRef);
        console.log("Image URL:", downloadURL);

        //  Save listing to Firestore
        const docRef = await addDoc(collection(db, "listings"), {
            userId: user.uid, //  Save user ID with the listing
            name: productName,
            price: `$${parseFloat(productPrice).toFixed(2)}`,
            category: productCategory,
            description: productDescription,
            image: downloadURL, // Firebase Storage image URL
            createdAt: serverTimestamp()
        });

        console.log("Listing Saved to Firestore:", docRef.id);
        alert('Listing Created Successfully!');
        window.location.href = 'home.html'; // Redirect to home page

    } catch (error) {
        console.error("Error saving listing:", error);
        alert("Error creating listing. Please try again.");
    }
});
