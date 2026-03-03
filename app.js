/* =========================
   VARIABLES GLOBALES
========================= */

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let points = parseInt(localStorage.getItem("points")) || 0;
let streak = parseInt(localStorage.getItem("streak")) || 0;
let lastCompletedDay = localStorage.getItem("lastCompletedDay") || null;

let container;
let modal;
let addBtn;
let saveBtn;
let progressBar;
let summary;
let calendarMini;

let editingTaskId = null;

/* =========================
   INICIO CUANDO CARGA DOM
========================= */

document.addEventListener("DOMContentLoaded", () => {

  container = document.getElementById("tasksContainer");
  modal = document.getElementById("modal");
  addBtn = document.getElementById("addTaskBtn");
  saveBtn = document.getElementById("saveTaskBtn");
  progressBar = document.getElementById("progressBar");
  summary = document.getElementById("summary");

  addBtn.onclick = () => {
    editingTaskId = null;
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDateTime").value = "";
    modal.classList.remove("hidden");
  };

  saveBtn.onclick = saveTask;

  /* CALENDARIO */
  calendarMini = new FullCalendar.Calendar(
    document.getElementById("calendarMini"),
    {
      initialView: "dayGridMonth",
      height: 300
    }
  );

  calendarMini.render();

  autoTheme();
  setInterval(autoTheme, 60000);

  render();
});

/* =========================
   GUARDAR TAREA
========================= */

function saveTask() {
  const titleInput = document.getElementById("taskTitle");
  const dateInput = document.getElementById("taskDateTime");
  const priority = document.getElementById("taskPriority").value;

  let title = titleInput.value;
  let date = dateInput.value;

  const parsed = parseNaturalDate(title);
  if (parsed) date = parsed;

  if (!title || !date) return alert("Completa los campos");

  if (editingTaskId) {
    const task = tasks.find(t => t.id === editingTaskId);
    task.title = title;
    task.date = date;
    task.priority = priority;
  } else {
    tasks.push({
      id: Date.now(),
      title,
      date,
      priority,
      completed: false
    });
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
  modal.classList.add("hidden");
  editingTaskId = null;

  render();
}

/* =========================
   RENDER
========================= */

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
      <button onclick="editTask(${task.id})">✏️</button>
      <button onclick="deleteTask(${task.id})">🗑</button>
    `;
    container.appendChild(div);
  });

  updateProgress();
  updateCalendar();
  updateLevelSystem();
}

/* =========================
   COMPLETAR TAREA
========================= */

function completeTask(id) {
  const task = tasks.find(t => t.id === id);
  task.completed = true;

  const today = new Date().toISOString().split("T")[0];

  if (lastCompletedDay !== today) {
    streak++;
    lastCompletedDay = today;
    localStorage.setItem("lastCompletedDay", today);
  }

  points += 10;

  localStorage.setItem("points", points);
  localStorage.setItem("streak", streak);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  render();
}

/* =========================
   EDITAR
========================= */

function editTask(id) {
  const task = tasks.find(t => t.id === id);

  editingTaskId = id;
  document.getElementById("taskTitle").value = task.title;
  document.getElementById("taskDateTime").value = task.date;
  document.getElementById("taskPriority").value = task.priority;

  modal.classList.remove("hidden");
}

/* =========================
   ELIMINAR
========================= */

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  render();
}

/* =========================
   CALENDARIO
========================= */

function updateCalendar() {
  if (!calendarMini) return;

  calendarMini.removeAllEvents();

  tasks
    .filter(t => !t.completed)
    .forEach(t => {
      calendarMini.addEvent({
        title: t.title,
        start: t.date,
        color:
          t.priority === "high"
            ? "red"
            : t.priority === "medium"
            ? "orange"
            : "green"
      });
    });
}

/* =========================
   NIVEL VIDEOJUEGO
========================= */

function updateLevelSystem() {
  const levelContainer = document.getElementById("levelSystem");
  if (!levelContainer) return;

  const xp = points;
  const level = Math.floor(xp / 100) + 1;
  const xpCurrentLevel = xp % 100;
  const xpNeeded = 100;

  const percent = (xpCurrentLevel / xpNeeded) * 100;

  levelContainer.innerHTML = `
    <div class="level-card">
      <h2>⭐ Nivel ${level}</h2>
      <div class="xp-bar-container">
        <div class="xp-bar" style="width:${percent}%"></div>
      </div>
      <p>${xpCurrentLevel} / ${xpNeeded} XP</p>
      <p>🔥 Racha: ${streak} días</p>
      <p>💎 Puntos totales: ${points}</p>
    </div>
  `;
}

/* =========================
   PROGRESO SUPERIOR
========================= */

function updateProgress() {
  const completed = tasks.filter(t => t.completed).length;
  const percent =
    tasks.length === 0 ? 0 : (completed / tasks.length) * 100;

  progressBar.style.width = percent + "%";
  summary.innerText = `⭐ ${points} pts | 🔥 Racha: ${streak} días`;
}

/* =========================
   PARSER SIMPLE DE FECHA
========================= */

function parseNaturalDate(text) {
  const lower = text.toLowerCase();
  const now = new Date();

  if (lower.includes("mañana")) {
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const hourMatch = lower.match(/(\d{1,2})(am|pm)?/);
    if (hourMatch) {
      let hour = parseInt(hourMatch[1]);
      if (hourMatch[2] === "pm" && hour < 12) hour += 12;
      tomorrow.setHours(hour, 0);
    }

    return tomorrow.toISOString().slice(0, 16);
  }

  return null;
}

/* =========================
   DARK MODE AUTO
========================= */

function autoTheme() {
  const hour = new Date().getHours();

  if (hour >= 19 || hour < 6) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}
