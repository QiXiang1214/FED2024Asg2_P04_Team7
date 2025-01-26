import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

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
const auth = getAuth(app);

// Show login form initially
document.getElementById("login-container").style.display = "block";

// Handle login form submission
document.getElementById("login-form").addEventListener("submit", async function (event) {
  event.preventDefault();
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Firebase login logic
  if (email && password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Log the user in and redirect to the spin page with their data
      alert(`Welcome back, ${user.email}`);
      document.getElementById("login-container").style.display = "none";

      // Store email and UID in sessionStorage (or you can use localStorage)
      sessionStorage.setItem("email", user.email);
      sessionStorage.setItem("uid", user.uid);

      // Redirect to the Spin The Wheel page
      window.location.href = "../html/spin_wheel.html"; // Replace with your spin page URL
    } catch (error) {
      console.error("Login failed:", error);
      alert(`Login failed: ${error.message}`);
      document.getElementById("error-message").style.display = "block";
    }
  } else {
    document.getElementById("error-message").style.display = "block";
  }
});

// Show the register form
document.getElementById("register-link").addEventListener("click", function () {
  document.getElementById("login-container").style.display = "none";
  document.getElementById("signup-container").style.display = "block";
});

// Handle user registration
document.getElementById("signup-form").addEventListener("submit", async function (event) {
  event.preventDefault();
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    alert("Registration successful! You can now log in.");
    document.getElementById("signup-container").style.display = "none";
    document.getElementById("login-container").style.display = "block";
  } catch (error) {
    console.error("Registration failed:", error);
    alert(`Registration failed: ${error.message}`);
    document.getElementById("signup-error-message").style.display = "block";
  }
});

// Handle forgot password form submission
document.getElementById("forget-form").addEventListener("submit", async function (event) {
  event.preventDefault();
  const email = document.getElementById("forget-email").value;

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent!");
    document.getElementById("forget-container").style.display = "none";
    document.getElementById("login-container").style.display = "block";
  } catch (error) {
    console.error("Password reset failed:", error);
    alert(`Failed to send reset email: ${error.message}`);
    document.getElementById("forget-error-message").style.display = "block";
  }
});

// Handle back to login from register form
document.getElementById("back-to-login-link").addEventListener("click", function () {
  document.getElementById("signup-container").style.display = "none";
  document.getElementById("login-container").style.display = "block";
});

// Handle back to login from forgot password form
document.getElementById("back-to-login-from-forget-link").addEventListener("click", function () {
  document.getElementById("forget-container").style.display = "none";
  document.getElementById("login-container").style.display = "block";
});
