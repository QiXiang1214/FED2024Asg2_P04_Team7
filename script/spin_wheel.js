const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");

// Object that stores values of minimum and maximum angle for a value
const rotationValues = [
  { minDegree: 0, maxDegree: 30, value: "2 points" },
  { minDegree: 31, maxDegree: 90, value: "5 points" },
  { minDegree: 91, maxDegree: 150, value: "0 points" },
  { minDegree: 151, maxDegree: 210, value: "1 point" },
  { minDegree: 211, maxDegree: 270, value: "0 points" },
  { minDegree: 271, maxDegree: 330, value: "7 points" },
];
