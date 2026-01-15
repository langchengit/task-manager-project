let currentFolder = JSON.parse(localStorage.getItem("currentFolder")) || null;

let folders = JSON.parse(localStorage.getItem("folders")) || {};
let courses = folders[currentFolder]?.courses || {};
let timePerDay = JSON.parse(localStorage.getItem("timePerDay")) || {};

console.log(courses);

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
  
  //change the background color to green

  document.body.style.backgroundColor = 'green';


  interval = setInterval(() => {
    courses[activeCourse].tasks[activeTaskIndex].timeSpent++;
    //add time to timePerDay
    saveData();
    updateDisplay();
  }, 1000);
}

function pauseTimer() {
  if (interval) {
    clearInterval(interval);
    interval = null;
    document.body.style.backgroundColor = 'orange';
  }
}

function resetTimer() {
  if (!activeCourse || activeTaskIndex === null) return;

  courses[activeCourse].tasks[activeTaskIndex].timeSpent = 0;
  document.body.style.backgroundColor = 'red';
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
  localStorage.setItem("folders", JSON.stringify(folders));
  localStorage.setItem("currentFolder", JSON.stringify(currentFolder));
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

document.getElementById("startBtn").addEventListener("click", startTimer);
document.getElementById("pauseBtn").addEventListener("click", pauseTimer);
document.getElementById("resetBtn").addEventListener("click", resetTimer);
