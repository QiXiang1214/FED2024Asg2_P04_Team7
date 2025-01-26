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

// Size of each piece
const data = [16, 16, 16, 16, 16, 16];

// Background color for each piece
var pieColors = [
    "#8b35bc",  // purple
    "#00bcd4",  // aqua 
    "#8b35bc",  // purple
    "#00bcd4",  // aqua
    "#8b35bc",  // purple
    "#00bcd4"   // aqua
  ];

  // Create chart
let myChart = new Chart(wheel, {
    plugins: [ChartDataLabels],
    type: "pie",
    data: {
      labels: ["5 points", "2 points", "7 points", "0 points", "1 point", "0 points"],
      datasets: [
        {
          backgroundColor: pieColors,
          data: data,
        },
      ],
    },
    options: {
      responsive: true,
      animation: { duration: 0 },
      plugins: {
        tooltip: false,
        legend: {
          display: false,
        },
        datalabels: {
          color: "#ffffff",
          formatter: (_, context) => context.chart.data.labels[context.dataIndex],
          font: { size: 24 },
        },
      },
    },
  });
  

  // Display value based on the random angle
const valueGenerator = (angleValue) => {
    for (let i of rotationValues) {
      if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
        finalValue.innerHTML = `<p>You receive ${i.value}</p>`;
        break;
      }
    }
  };
  