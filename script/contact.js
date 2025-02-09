// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  updateDoc 
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get form and success message elements
const form = document.querySelector('.contact-form');
const successMessage = document.getElementById('success-message');

// Handle form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get form data
  const email = form.email.value.trim();
  const subject = form.subject.value;
  const message = form.message.value.trim();

  // Function to format dates in dd/mm/yyyy and HH:MM AM/PM format
  const formatSGTDate = (date) => {
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

  const now = new Date();
  const formattedNow = formatSGTDate(now);

  try {
    // Check for existing document with matching email and subject
    const q = query(
      collection(db, 'ContactUs'),
      where('email', '==', email),
      where('subject', '==', subject)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Update existing document (message and timestamp)
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, {
        message: message,
        timestamp: formattedNow
      });
      console.log('Document updated:', docRef.id);
    } else {
      // Create new document
      await addDoc(collection(db, 'ContactUs'), {
        email,
        subject,
        message,
        timestamp: new Date()
      });
      console.log('New document created.');
    }

    // Show success message as a popup that fades out after 3 seconds
    successMessage.classList.add("show");
    setTimeout(() => {
      successMessage.classList.remove("show");
    }, 3000);

    form.reset();
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
});

//Toggle Menu
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  menuToggle.addEventListener("click", function () {
      navLinks.classList.toggle("active");
  });
});