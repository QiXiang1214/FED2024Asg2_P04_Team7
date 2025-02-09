// Import necessary Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

// DOM elements for the wheel
const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");

// Rotation values for the wheel
const rotationValues = [
  { minDegree: 0, maxDegree: 30, value: "2 points" },
  { minDegree: 31, maxDegree: 90, value: "5 points" },
  { minDegree: 91, maxDegree: 150, value: "0 points" },
  { minDegree: 151, maxDegree: 210, value: "1 point" },
  { minDegree: 211, maxDegree: 270, value: "0 points" },
  { minDegree: 271, maxDegree: 330, value: "7 points" }
];

// Data for the pie chart
const data = [16, 16, 16, 16, 16, 16];
const pieColors = ["#8b35bc", "#00bcd4", "#8b35bc", "#00bcd4", "#8b35bc", "#00bcd4"];

// Create the Chart.js pie chart
let myChart = new Chart(wheel, {
  plugins: [ChartDataLabels],
  type: "pie",
  data: {
    labels: ["5 points", "2 points", "7 points", "0 points", "1 point", "0 points"],
    datasets: [
      {
        backgroundColor: pieColors,
        data: data
      }
    ]
  },
  options: {
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      tooltip: false,
      legend: { display: false },
      datalabels: {
        color: "#ffffff",
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { 
          size: window.innerWidth <= 768 ? 12 : 24 
        }
      }
    }
  }
});

// Add window resize handler to update font size when screen size changes
window.addEventListener('resize', () => {
  myChart.options.plugins.datalabels.font.size = window.innerWidth <= 768 ? 12 : 24;
  myChart.update();
});

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

// Function to log spin results and update user data in Firestore
const logResult = async (result, userId, username) => {
  try {
    const now = new Date();
    const nextSpin = new Date();
    nextSpin.setDate(now.getDate() + 1);

    const formattedNow = formatSGTDate(now);
    const formattedNextSpin = formatSGTDate(nextSpin);

    // Reference to the user's document in the Firestore collection
    const userDocRef = doc(db, "spinTheWheel", userId);
    const userDocSnap = await getDoc(userDocRef);

    // Initialize points if the user document doesn't exist
    let currentTotalPoints = 0;
    if (userDocSnap.exists()) {
      currentTotalPoints = userDocSnap.data().totalPoints || 0;
    } else {
      // If the user document doesn't exist, create it with initial data
      await setDoc(userDocRef, {
        username: username,
        totalPoints: 0,
        lastSpinTime: formattedNow,
        nextSpinTime: formattedNextSpin,
        uid: userId
      });
    }

    // Extract points from the result (e.g., "1 point" -> 1)
    const pointsFromSpin = parseInt(result.split(" ")[0], 10) || 0;
    const updatedTotalPoints = currentTotalPoints + pointsFromSpin;

    // Update the user document with the new data
    await updateDoc(userDocRef, {
      lastSpinTime: formattedNow,
      nextSpinTime: formattedNextSpin,
      result: result,
      totalPoints: updatedTotalPoints,
      uid: userId,
      username: username
    });

    console.log(`Spin logged: ${result}. Total points for user ${userId}: ${updatedTotalPoints}`);
  } catch (error) {
    console.error("Error logging spin result:", error);
  }
};

// Function to parse date from Firestore string format (e.g., "09/02/2025 6:01 PM")
const parseSGTDate = (dateString) => {
  const [datePart, timePart] = dateString.split(" ");
  const [day, month, year] = datePart.split("/");
  const [hours, minutes] = timePart.split(":");

  let hour = parseInt(hours);
  const minute = parseInt(minutes);
  const ampm = timePart.includes("PM") ? "PM" : "AM";

  // Convert hour to 24-hour format for JavaScript Date
  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  return new Date(year, month - 1, day, hour, minute);
};

// Function to check spin availability
const checkSpinAvailability = async (user) => {
  const userDocRef = doc(db, "spinTheWheel", user.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    const userData = userDocSnap.data();
    const now = new Date();
    const nextSpinTime = parseSGTDate(userData.nextSpinTime); // Use the new parseSGTDate function

    if (now < nextSpinTime) {
      const timeLeftMs = nextSpinTime - now;
      const hoursLeft = Math.floor(timeLeftMs / (1000 * 60 * 60));
      const minutesLeft = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
      finalValue.innerHTML = `<p>Next spin available in ${hoursLeft}h ${minutesLeft}m</p>`;
      return false;
    }
  }
  return true;
};

// Function to determine the spin result based on the random angle
const valueGenerator = (angleValue) => {
  for (let i of rotationValues) {
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      const spinResult = i.value;
      finalValue.innerHTML = `<p>You receive ${spinResult}</p>`;

      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const username = user.email;

        // Log the spin result in Firestore
        logResult(spinResult, userId, username);
      }
      break;
    }
  }
};

// Spin button logic
let count = 0;
let resultValue = 101;
let randomDegree = 0;

spinBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) {
    finalValue.innerHTML = `<p>Please log in to spin.</p>`;
    return;
  }

  const canSpin = await checkSpinAvailability(user);
  if (!canSpin) return;

  spinBtn.disabled = true;
  finalValue.innerHTML = `<p>Good Luck!</p>`;
  randomDegree = Math.floor(Math.random() * 360);

  let rotationInterval = window.setInterval(() => {
    myChart.options.rotation = myChart.options.rotation + resultValue;
    myChart.update();

    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = 0;
    } else if (count > 15 && myChart.options.rotation == randomDegree) {
      valueGenerator(randomDegree);
      clearInterval(rotationInterval);
      count = 0;
      resultValue = 101;
      spinBtn.disabled = false;
    }
  }, 10);
});

// Firebase auth state observer (user logged in)
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(`User logged in: ${user.email}`);
  } else {
    console.log("No user logged in");
  }
});
