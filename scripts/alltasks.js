let courses = JSON.parse(localStorage.getItem("courses")) || {};

function saveData() {
  localStorage.setItem("courses", JSON.stringify(courses));
}

// ---------- Render All Tasks ----------

function renderAllTasks() {
  const list = document.getElementById("all-tasks-section");
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
      };

      li.innerHTML = `
        <div>${task.text}</div>
        <div class="task-date">Due: ${task.dueDate}</div>
        <div class="task-course">${task.course}</div>
      `;
      
      li.appendChild(statusSelect);
      list.appendChild(li);
    });

    const backBtn = document.createElement("a");
    backBtn.textContent = "Back to Task Manager";
    backBtn.href = "index.html";
    backBtn.className = "go-back-btn";
    list.appendChild(backBtn);
}

renderAllTasks();