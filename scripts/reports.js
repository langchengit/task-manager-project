let currentFolder = JSON.parse(localStorage.getItem("currentFolder")) || null;
let timeSpentEachCourse = {};
let courses = {};
if(currentFolder != null) {
  courses = JSON.parse(localStorage.getItem("folders"))[currentFolder]?.courses || {};
}
let timePerDay = JSON.parse(localStorage.getItem("timePerDay")) || {};

function calculateTimeSpentEachCourse() {
  
  for(let courseName in courses){
    let tasks = courses[courseName].tasks;
    let totalTime = 0;
    tasks.forEach((task) => {
      totalTime += task.timeSpent;
    });

    timeSpentEachCourse[courseName] = totalTime;

  };
}

calculateTimeSpentEachCourse();

console.log(timeSpentEachCourse);

function renderPieChart() {

  const labels = [];
  const times = [];
  const colors = [];

  for (let courseName in courses) {
    let totalTime = 0;

    courses[courseName].tasks.forEach(task => {
      totalTime += task.timeSpent;
    });

    if (totalTime > 0) {
      labels.push(courseName);
      times.push(totalTime);
      colors.push(courses[courseName].color || "#4a90e2");
    }
  }

  if(labels.length === 0) {
    document.getElementById("noDataMessagePie").classList.remove("hidden");
    document.getElementById("timePieChart").classList.add("hidden");
    return;
  }
  
  const ctx = document.getElementById("timePieChart");

  const data = {
    labels: labels,
    datasets: [{
      label: "Time",
      data: times,
      backgroundColor: colors
    }],
    hoverOffset: 4
  }

  new Chart(ctx, {
    type: 'pie',
    data: data,
    options: {
      responsive: false,
      plugins: {
        legend: {
          position: "bottom"
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const seconds = context.raw;
              return `${context.label}: ${formatTime(seconds)}`;
            }
          }
        }
      }
    }
  });
  
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}

function renderLineGraph() {

  if(Object.keys(timePerDay).length === 0) {
    document.getElementById("noDataMessageLine").classList.remove("hidden");
    document.getElementById("timeLineGraph").classList.add("hidden");
    return;
  }

  const labels = Object.keys(timePerDay);
  const dataPoints = Object.values(timePerDay);
  
  const ctx = document.getElementById("timeLineGraph");
  console.log(ctx);

  const data = {
    labels: labels,
    datasets: [{
      label: "Time Spent (seconds)",
      data: dataPoints,
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1, 
      borderWidth: 3
    }]
  };

  new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
      responsive: false,
      plugins: {
        legend: {
          position: "bottom"
        }
      }, 

      scales: {
        x: {
          offset: true,
          grid: {
            display: false
          }
        }, 
        y: {
          grid: {
            color: "rgba(0,0,0,0.06)"
          }
        }
      }

    }
    
  });
}

renderPieChart();
renderLineGraph();