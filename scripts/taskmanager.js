
let folders = JSON.parse(localStorage.getItem("folders")) || {};
let currentFolder = JSON.parse(localStorage.getItem("currentFolder")) || null;
let currentCourse = null;

function saveData() {
  localStorage.setItem("folders", JSON.stringify(folders));
  localStorage.setItem("currentFolder", JSON.stringify(currentFolder));
  renderSortedTasks();
}

// ---------- Folder Management ----------

function addFolder() {
  const input = document.getElementById("folderInput");
  const folderName = input.value.trim();

  if (!folderName) {
    alert("Folder name cannot be empty!");
    return;
  }

  if (folders[folderName]) {
    alert("Folder already exists!");
    return;
  }

  folders[folderName] = {
    courses: {}
  };
  input.value = "";
  saveData();
  renderFolderSelect();
}

function renderFolderSelect() {
  const select = document.getElementById("folderSelect");
  if (!select) return;
  
  select.innerHTML = "";

  for (let folder in folders) {
    const option = document.createElement("option");
    option.value = folder;
    option.textContent = folder;
    select.appendChild(option);
  }

  if (Object.keys(folders).length > 0 && !currentFolder) {
    currentFolder = Object.keys(folders)[0];
    select.value = currentFolder;
    renderGallery();
  }
}

function switchFolder() {
  currentFolder = document.getElementById("folderSelect").value;
  renderGallery();
}



// ---------- Courses ----------

function addCourse() {
  if (!currentFolder) {
    alert("Please create a folder first!");
    return;
  }

  const input = document.getElementById("courseInput");
  const colorInput = document.getElementById("courseColorInput");
  const name = input.value.trim();

  if (!name) {
    alert("Course name cannot be empty!");
    return;
  }

  if (folders[currentFolder].courses[name]) {
    alert("Course already exists in this folder!");
    return;
  }

  folders[currentFolder].courses[name] = {
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

  if (!currentFolder || !folders[currentFolder]) {
    return;
  }

  const courses = folders[currentFolder].courses;

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
      delete folders[currentFolder].courses[course];
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
  document.getElementById("taskTitle").style.color = folders[currentFolder].courses[course].color;
  document.getElementById("taskSection").classList.remove("hidden");
  document.getElementById("courseGallery").classList.add("hidden");

  renderTasks();
}

function addTask() {
  const text = document.getElementById("taskInput").value.trim();
  const dueDate = document.getElementById("dueDateInput").value;
  const status = document.getElementById("statusInput").value;

  if (!text || !dueDate) return;

  folders[currentFolder].courses[currentCourse].tasks.push({
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

  folders[currentFolder].courses[currentCourse].tasks.forEach((task, index) => {

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
        folders[currentFolder].courses[currentCourse].tasks.splice(index, 1);
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

  for (let folder in folders) {
    for (let course in folders[folder].courses) {
      folders[folder].courses[course].tasks.forEach((task, index) => {
        allTasks.push({ ...task, folder, course, index });
      });
    }
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
        folders[task.folder].courses[task.course].tasks[task.index].status = statusSelect.value;
        folders[task.folder].courses[task.course].tasks[task.index].completed = statusSelect.value === "Completed";
        saveData();
        renderTasks();
      };

      li.innerHTML = `
        <div>${task.text}</div>
        <div class="task-date">Due: ${task.dueDate}</div>
        <div class="task-course">${task.course}</div>
      `;

      if(!task.completed) {
        if(createDate(task.dueDate) < new Date()) {
          const alertIcon = document.createElement("span");
          alertIcon.className = "alert-icon";
          alertIcon.title = "Overdue Task";
          alertIcon.textContent = "⚠️";
          li.querySelector("div").appendChild(alertIcon);
        }

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

function createDate(dateStr) {
  const parts = dateStr.split("-");
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

// ---------- Navigation ----------

function goBack() {
  document.getElementById("taskSection").classList.add("hidden");
  document.getElementById("courseGallery").classList.remove("hidden");
}

// Initial load
if (document.getElementById("folderSelect")) {
  renderFolderSelect();
  renderGallery();
  renderSortedTasks();

  // ---------- Event Listeners ----------

  document.getElementById("folderSelect").addEventListener("change", switchFolder);
  document.getElementById("createFolderBtn").addEventListener("click", addFolder);
  document.getElementById("addCourseBtn").addEventListener("click", addCourse);
  document.getElementById("addTaskBtn").addEventListener("click", addTask);
  document.getElementById("backBtn").addEventListener("click", goBack);
}
