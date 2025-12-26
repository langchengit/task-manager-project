let courses = JSON.parse(localStorage.getItem("courses")) || {};
let currentCourse = null;

function saveData() {
  localStorage.setItem("courses", JSON.stringify(courses));
  renderSortedTasks();
}

// ---------- Courses ----------

function addCourse() {
  const input = document.getElementById("courseInput");
  const name = input.value.trim();

  if (!name || courses[name]) return;

  courses[name] = [];
  input.value = "";

  saveData();
  renderGallery();
}

function renderGallery() {
  const gallery = document.getElementById("courseGallery");
  gallery.innerHTML = "";

  for (let course in courses) {
    const card = document.createElement("div");
    card.className = "course-card";
    card.textContent = course;
    card.onclick = () => openCourse(course);
    gallery.appendChild(card);
  }
}

// ---------- Tasks (Per Course) ----------

function openCourse(course) {
  currentCourse = course;

  document.getElementById("taskTitle").textContent = course;
  document.getElementById("taskSection").classList.remove("hidden");
  document.getElementById("courseGallery").classList.add("hidden");

  renderTasks();
}

function addTask() {
  const text = document.getElementById("taskInput").value.trim();
  const dueDate = document.getElementById("dueDateInput").value;
  const status = document.getElementById("statusInput").value;

  if (!text || !dueDate) return;

  courses[currentCourse].push({
    text,
    dueDate,
    status,
    completed: status === "Completed"
  });

  document.getElementById("taskInput").value = "";
  document.getElementById("dueDateInput").value = "";
  document.getElementById("statusInput").value = "Not Started";

  saveData();
  renderTasks();
}


function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  courses[currentCourse].forEach((task, index) => {
    const li = document.createElement("li");

    const statusSelect = document.createElement("select");
    ["Not Started", "In Progress", "Completed"].forEach(option => {
      const opt = document.createElement("option");
      opt.value = option;
      opt.textContent = option;
      if (option === task.status) opt.selected = true;
      statusSelect.appendChild(opt);
    });

    statusSelect.onchange = () => {
      task.status = statusSelect.value;
      task.completed = task.status === "Completed";
      saveData();
      renderTasks();
    };

    li.innerHTML = `
      <div>${task.text}</div>
      <div class="task-date">Due: ${task.dueDate}</div>
    `;

    if (!task.completed){
      li.appendChild(statusSelect);
      list.appendChild(li);
    }
  });
}


// ---------- Sorted Right Panel ----------

function renderSortedTasks() {
  const list = document.getElementById("sortedTaskList");
  list.innerHTML = "";

  const allTasks = [];

  for (let course in courses) {
    courses[course].forEach((task, index) => {
      allTasks.push({ ...task, course, index });
    });
  }

  allTasks
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .forEach(task => {
      const li = document.createElement("li");

      const statusSelect = document.createElement("select");
      ["Not Started", "In Progress", "Completed"].forEach(option => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option;
        if (option === task.status) opt.selected = true;
        statusSelect.appendChild(opt);
      });

      statusSelect.onchange = () => {
        courses[task.course][task.index].status = statusSelect.value;
        courses[task.course][task.index].completed = statusSelect.value === "Completed";
        saveData();
        renderTasks();
      };

      li.innerHTML = `
        <div>${task.text}</div>
        <div class="task-date">Due: ${task.dueDate}</div>
        <div class="task-course">${task.course}</div>
      `;

      if(!task.completed) {
        li.appendChild(statusSelect);
        list.appendChild(li);
      }
    });
}

// ---------- Navigation ----------

function goBack() {
  document.getElementById("taskSection").classList.add("hidden");
  document.getElementById("courseGallery").classList.remove("hidden");
}

// Initial load
renderGallery();
renderSortedTasks();
