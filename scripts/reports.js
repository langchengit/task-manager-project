timeSpentEachCourse = {};
let courses = JSON.parse(localStorage.getItem("courses")) || {};

function calculateTimeSpentEachCourse() {
  
  for(let courseName in courses){
    tasks = courses[courseName].tasks;
    totalTime = 0;
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


renderPieChart();
