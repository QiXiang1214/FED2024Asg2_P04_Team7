import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    sendPasswordResetEmail, 
    setPersistence, 
    browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Firebase configuration
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

// Set authentication persistence
setPersistence(auth, browserLocalPersistence)
    .catch(error => console.error("Error setting persistence:", error));

//  Ensure the DOM is fully loaded before adding event listeners
document.addEventListener("DOMContentLoaded", function () {

    console.log("DOM fully loaded, attaching event listeners.");

    //  Fix for Register Button Not Working
    const registerLink = document.getElementById("register-link");
    if (registerLink) {
        registerLink.addEventListener("click", function (event) {
            event.preventDefault();
            console.log("Register button clicked!");
            document.getElementById("login-container").style.display = "none";
            document.getElementById("signup-container").style.display = "block";
        });
    } else {
        console.error("Register link not found in the document.");
    }

    //  Fix for "Back to Login" link
    const backToLoginLink = document.getElementById("back-to-login-link");
    if (backToLoginLink) {
        backToLoginLink.addEventListener("click", function (event) {
            event.preventDefault();
            console.log("Back to login button clicked!");
            document.getElementById("signup-container").style.display = "none";
            document.getElementById("login-container").style.display = "block";
        });
    }

    //  Fix for "Back to Login" from Forgot Password Page
    const backToLoginForget = document.getElementById("back-to-login-from-forget-link");
    if (backToLoginForget) {
        backToLoginForget.addEventListener("click", function (event) {
            event.preventDefault();
            console.log("Back to login from forgot password clicked!");
            document.getElementById("forget-container").style.display = "none";
            document.getElementById("login-container").style.display = "block";
        });
    }

    //  Handle login form submission
    document.getElementById("login-form").addEventListener("submit", async function (event) {
        event.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("password").value;
    
        if (email && password) {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
    
                alert(`Welcome back, ${user.email}`);
    
                // 🎬 Show Lottie Animation
                const lottieContainer = document.getElementById("lottie-container");
                lottieContainer.style.display = "flex"; // Make it visible
    
                // ✅ Load Lottie Animation
                const animation = lottie.loadAnimation({
                    container: document.getElementById("lottie-animation"), // Animation container
                    renderer: "svg",
                    loop: false,
                    autoplay: true,
                    path: "../json/animation.json", // ✅ Path to local JSON file
                });
    
                // ⏳ Wait for animation (2.5s) then redirect
                setTimeout(() => {
                    window.location.href = "../html/home.html"; // Redirect after animation
                }, 3000);
    
            } catch (error) {
                console.error("Login failed:", error);
                alert(`Login failed: ${error.message}`);
            }
        }
    });
    
    

    

   // Handle user registration
document.getElementById("signup-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const username = document.getElementById("signup-username").value.trim();

    if (!email || !password || !username) {
        alert("All fields are required!");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const uid = user.uid; //  Get the UID

        //  Save user data to Firestore (including UID)
        await setDoc(doc(db, "register", uid), {
            uid: uid,          //  Store UID
            email: user.email, // Store email
            username: username, // Store username
            password: password, //  Password stored as plain text (not recommended)
            createdAt: new Date() // Store registration time
        });

        alert("Registration successful! You can now log in.");
        document.getElementById("signup-container").style.display = "none";
        document.getElementById("login-container").style.display = "block";
    } catch (error) {
        if (error.code === "auth/email-already-in-use") {
            alert("This email is already registered. Please log in instead.");
        } else {
            console.error("Registration failed:", error);
            alert(`Registration failed: ${error.message}`);
        }
    }
});

});
