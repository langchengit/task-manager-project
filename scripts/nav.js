function loadNav() {
  const navbar = document.getElementById('nav');
  navbar.innerHTML = `
    <div class="mainNav">
      <div class="nav-left">
        <a href="taskmanager.html" class="nav-btn">Task Manager</a>
        <a href="timer.html" class="nav-btn">Timer</a>
        <a href="reports.html" class="nav-btn">Reports</a>
      </div>
      <div class="nav-right">
        <a href="login.html" class="nav-btn login-btn">Login</a>
        <img src="../images/logo.png" id="logo" alt="Logo">
      </div>
    </div>
  `;
}

loadNav();
