
let courses = JSON.parse(localStorage.getItem("courses")) || {};

let activeCourse = null;
let activeTaskIndex = null;
let interval = null;

// ---------- Populate Selects ----------

function loadCourses() {
  const courseSelect = document.getElementById("courseSelect");
  courseSelect.innerHTML = `<option value="">Select Course</option>`;

  Object.keys(courses).forEach(course => {
    const opt = document.createElement("option");
    opt.value = course;
    opt.textContent = course;
    courseSelect.appendChild(opt);
  });
}

function loadTasks(course) {
  const taskSelect = document.getElementById("taskSelect");
  taskSelect.innerHTML = `<option value="">Select Task</option>`;

  courses[course].tasks.forEach((task, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = task.text;
    taskSelect.appendChild(opt);
  });
}

// ---------- Timer Logic ----------

function startTimer() {
  if (!activeCourse || activeTaskIndex === null) return;

  pauseTimer();

  interval = setInterval(() => {
    courses[activeCourse].tasks[activeTaskIndex].timeSpent++;
    saveData();
    updateDisplay();
  }, 1000);
}

function pauseTimer() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
}

function resetTimer() {
  if (!activeCourse || activeTaskIndex === null) return;

  courses[activeCourse].tasks[activeTaskIndex].timeSpent = 0;
  saveData();
  updateDisplay();
}

function updateDisplay() {
  const seconds = courses[activeCourse].tasks[activeTaskIndex].timeSpent;
  document.getElementById("timerDisplay").textContent = formatTime(seconds);
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// ---------- Storage ----------

function saveData() {
  localStorage.setItem("courses", JSON.stringify(courses));
}

// ---------- Event Listeners ----------

document.getElementById("courseSelect").addEventListener("change", e => {
  activeCourse = e.target.value;
  activeTaskIndex = null;
  loadTasks(activeCourse);
  document.getElementById("timerDisplay").textContent = "00:00:00";
});

document.getElementById("taskSelect").addEventListener("change", e => {
  activeTaskIndex = Number(e.target.value);
  updateDisplay();
});

// ---------- Init ----------
loadCourses(); 

console.log(courses);




// function updateClock() {
//   const now = new Date();

//   let hours = now.getHours();
//   let minutes = now.getMinutes();
//   let seconds = now.getSeconds();

//   // Add leading zeros
//   hours = String(hours).padStart(2, "0");
//   minutes = String(minutes).padStart(2, "0");
//   seconds = String(seconds).padStart(2, "0");

//   document.getElementById("clock").textContent =
//     `${hours}:${minutes}:${seconds}`;
// }

// function loadWindow(name) {
//   fetch(`${name}.html`)
//     .then(res => res.text())
//     .then(html => {
//       document.getElementById("windowContainer").innerHTML = html;

//       if (name === "timer") {
//         updateClock();                 // run once immediately
//         setInterval(updateClock, 1000); // update every second
//       }
//     });
// }
