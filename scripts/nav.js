function loadNav() {
  const navbar = document.getElementById('nav');
  navbar.innerHTML = `
  <div class="mainNav">
    <ul>
      <li>
        <div class="control">
          <a href="taskmanager.html">Task Manager</a>
          <a href="timer.html">Timer</a>
          <a href="reports.html">Reports</a>
        </div>

        <div class="account">
          <a href="login.html">Login</a>
        </div>
      </li>
    </ul>
  </div>
  `;
}

loadNav();