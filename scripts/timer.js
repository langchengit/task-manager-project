function updateClock() {
  const now = new Date();

  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  // Add leading zeros
  hours = String(hours).padStart(2, "0");
  minutes = String(minutes).padStart(2, "0");
  seconds = String(seconds).padStart(2, "0");

  document.getElementById("clock").textContent =
    `${hours}:${minutes}:${seconds}`;
}

function loadWindow(name) {
  fetch(`${name}.html`)
    .then(res => res.text())
    .then(html => {
      document.getElementById("windowContainer").innerHTML = html;

      if (name === "timer") {
        updateClock();                 // run once immediately
  setInterval(updateClock, 1000); // update every second
      }
    });
}
