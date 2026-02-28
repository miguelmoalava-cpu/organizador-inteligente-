let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let points = parseInt(localStorage.getItem("points")) || 0;
let streak = parseInt(localStorage.getItem("streak")) || 0;

const container = document.getElementById("tasksContainer");
const modal = document.getElementById("modal");
const addBtn = document.getElementById("addTaskBtn");
const saveBtn = document.getElementById("saveTaskBtn");
const progressBar = document.getElementById("progressBar");
const summary = document.getElementById("summary");

addBtn.onclick = () => modal.classList.remove("hidden");
saveBtn.onclick = saveTask;

function saveTask() {
  const title = document.getElementById("taskTitle").value;
  const date = document.getElementById("taskDateTime").value;
  const priority = document.getElementById("taskPriority").value;

  if (!title || !date) return alert("Completa los campos");

  tasks.push({
    id: Date.now(),
    title,
    date,
    priority,
    completed: false
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
  modal.classList.add("hidden");
  render();
}

function render() {
  container.innerHTML = "";

  tasks.forEach(task => {
    if (task.completed) return;

    const div = document.createElement("div");
    div.className = `task priority-${task.priority}`;
    div.innerHTML = `
      <strong>${task.title}</strong>
      <small>${new Date(task.date).toLocaleString()}</small>
      <button onclick="completeTask(${task.id})">✔</button>
      <button onclick="deleteTask(${task.id})">🗑</button>
    `;
    container.appendChild(div);
  });

  summary.innerText = `⭐ ${points} pts | 🔥 Racha: ${streak}`;
  updateCalendar();
  updateChart();
}

function completeTask(id) {
  const task = tasks.find(t => t.id === id);
  task.completed = true;
  points += 10;
  streak++;

  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("points", points);
  localStorage.setItem("streak", streak);

  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  render();
}

let calendarMini;

document.addEventListener("DOMContentLoaded", () => {
  calendarMini = new FullCalendar.Calendar(
    document.getElementById("calendarMini"),
    {
      initialView: window.innerWidth < 600 ? "listWeek" : "dayGridMonth",
      height: 350,
      headerToolbar: {
        left: "prev,next",
        center: "title",
        right: ""
      }
    }
  );
  calendarMini.render();
  render();
});

function updateCalendar() {
  if (!calendarMini) return;
  calendarMini.removeAllEvents();
  tasks.filter(t => !t.completed).forEach(t => {
    calendarMini.addEvent({ title: t.title, start: t.date });
  });
}

let chart;

function updateChart() {
  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.filter(t => !t.completed).length;

  const ctx = document.getElementById("weeklyChart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Completadas", "Pendientes"],
      datasets: [{
        data: [completed, pending]
      }]
    }
  });
}

function autoTheme() {
  const hour = new Date().getHours();
  if (hour >= 19 || hour < 6) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}

autoTheme();
setInterval(autoTheme, 60000);
