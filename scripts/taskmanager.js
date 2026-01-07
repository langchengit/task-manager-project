
let courses = JSON.parse(localStorage.getItem("courses")) || {};
let currentCourse = null;

// function loadWindow(name) {
//   fetch(`${name}.html`)
//     .then(res => res.text())
//     .then(html => {
//       document.getElementById("windowContainer").innerHTML = html;

//       if (name === "taskmanager") {
//         renderGallery();
//         renderSortedTasks();
//       }
//     });
// }



function saveData() {
  localStorage.setItem("courses", JSON.stringify(courses));
  renderSortedTasks();
}

// ---------- Courses ----------

function addCourse() {
  const input = document.getElementById("courseInput");
  const colorInput = document.getElementById("courseColorInput");
  const name = input.value.trim();

  if(courses[name]) {
    alert("Course already exists!");
    return;
  }
  if (!name) {
    alert("Course name cannot be empty!");
    return;
  }

  courses[name] = {
    color: colorInput.value, 
    tasks: []
  };
  input.value = "";
  colorInput.value = "#4a90e2";

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
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-course-btn";
    deleteBtn.textContent = "×";
    card.appendChild(deleteBtn);
    
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      delete courses[course];
      saveData();
      renderGallery();
    }
    card.onclick = () => openCourse(course);
    gallery.appendChild(card);
  }
}

// ---------- Tasks (Per Course) ----------

function openCourse(course) {
  currentCourse = course;

  document.getElementById("taskTitle").textContent = course;
  document.getElementById("taskTitle").style.color = courses[course].color;
  document.getElementById("taskSection").classList.remove("hidden");
  document.getElementById("courseGallery").classList.add("hidden");

  renderTasks();
}

function addTask() {
  const text = document.getElementById("taskInput").value.trim();
  const dueDate = document.getElementById("dueDateInput").value;
  const status = document.getElementById("statusInput").value;

  if (!text || !dueDate) return;

  courses[currentCourse].tasks.push({
    text,
    dueDate,
    status,
    completed: status === "Completed",
    timeSpent: 0
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

  courses[currentCourse].tasks.forEach((task, index) => {


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

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-task-btn";
      deleteBtn.textContent = "×";
      li.appendChild(deleteBtn);
      
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        courses[currentCourse].tasks.splice(index, 1);
        renderTasks();
        saveData();
        renderGallery();
      }

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
    courses[course].tasks.forEach((task, index) => {
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
        courses[task.course].tasks[task.index].status = statusSelect.value;
        courses[task.course].tasks[task.index].completed = statusSelect.value === "Completed";
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

    
    const showAllTasks = document.createElement("a");
    showAllTasks.textContent = "Show All Tasks";
    showAllTasks.className = "show-all-tasks-link";
    showAllTasks.href = "alltasks.html";
    list.appendChild(showAllTasks);
}

// ---------- Navigation ----------

function goBack() {
  document.getElementById("taskSection").classList.add("hidden");
  document.getElementById("courseGallery").classList.remove("hidden");
}

// Initial load
renderGallery();
renderSortedTasks();
