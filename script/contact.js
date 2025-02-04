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
  const firstName = form.firstName.value.trim();
  const lastName = form.lastName.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const subject = form.subject.value;
  const message = form.message.value.trim();

  try {
    // Check for existing document with matching email, phone, first name, last name, and subject
    const q = query(
      collection(db, 'ContactUs'),
      where('email', '==', email),
      where('phone', '==', phone),
      where('firstName', '==', firstName),
      where('lastName', '==', lastName),
      where('subject', '==', subject)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Update existing document (message and timestamp)
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, {
        message: message,
        timestamp: new Date()
      });
      console.log('Document updated:', docRef.id);
    } else {
      // Check if email exists (for phone/name validation)
      const emailQuery = query(collection(db, 'ContactUs'), where('email', '==', email));
      const emailQuerySnapshot = await getDocs(emailQuery);

      if (!emailQuerySnapshot.empty) {
        let isPhoneValid = true;
        emailQuerySnapshot.forEach((doc) => {
          if (doc.data().phone !== phone || doc.data().firstName !== firstName || doc.data().lastName !== lastName) {
            isPhoneValid = false;
          }
        });

        if (!isPhoneValid) {
          alert('Invalid phone number or name for the linked email.');
          return;
        }
      }

      // Create new document
      await addDoc(collection(db, 'ContactUs'), {
        firstName,
        lastName,
        email,
        phone,
        subject,
        message,
        timestamp: new Date()
      });
      console.log('New document created.');
    }

    // Show success message
    successMessage.style.display = 'block';
    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 3000);

    form.reset();
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
});