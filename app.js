let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let calendarMini;
let calendarFull;
let weeklyChart;

/* ===== FECHA LOCAL ===== */
function getTodayLocal() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/* ===== IA BÁSICA "mañana" ===== */
function parseNaturalDate(text) {
  const today = new Date();

  if (text.toLowerCase().includes("mañana")) {
    today.setDate(today.getDate() + 1);
  }

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* ===== ESTADÍSTICAS ===== */
function getWeeklyStats() {
  const now = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(now.getDate() - 7);

  const createdThisWeek = tasks.filter(t =>
    t.createdAt && new Date(t.createdAt) >= weekAgo
  ).length;

  const completedThisWeek = tasks.filter(t =>
    t.completed && t.createdAt && new Date(t.createdAt) >= weekAgo
  ).length;

  const productivity = createdThisWeek > 0
    ? Math.round((completedThisWeek / createdThisWeek) * 100)
    : 0;

  return { createdThisWeek, completedThisWeek, productivity };
}

/* ===== ELEMENTOS ===== */
const tasksContainer = document.getElementById("tasksContainer");
const summary = document.getElementById("summary");
const progressBar = document.getElementById("progressBar");

const modal = document.getElementById("modal");
const addTaskBtn = document.getElementById("addTaskBtn");
const saveTaskBtn = document.getElementById("saveTaskBtn");

const taskTitle = document.getElementById("taskTitle");
const taskDate = document.getElementById("taskDate");
const taskPriority = document.getElementById("taskPriority");

/* ===== GUARDAR ===== */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function openModal(date = "") {
  modal.classList.remove("hidden");
  if (date) taskDate.value = date;
}

function closeModal() {
  modal.classList.add("hidden");
  taskTitle.value = "";
  taskDate.value = "";
}

addTaskBtn.onclick = () => openModal();

/* ===== GUARDAR TAREA ===== */
saveTaskBtn.onclick = () => {
  if (!taskTitle.value) return;

  let detectedDate = taskDate.value;

  if (!detectedDate) {
    detectedDate = parseNaturalDate(taskTitle.value);
  }

  tasks.push({
    id: Date.now(),
    title: taskTitle.value,
    dueDate: detectedDate,
    priority: taskPriority.value,
    completed: false,
    createdAt: new Date().toISOString()
  });

  saveTasks();
  renderTasks();
  closeModal();
};

/* ===== RENDER ===== */
function renderTasks() {

  tasks.sort((a, b) => {
    const order = { high: 1, medium: 2, low: 3 };
    return order[a.priority] - order[b.priority];
  });

  tasksContainer.innerHTML = "";
  const today = getTodayLocal();

  const todayTasks = tasks.filter(t => t.dueDate === today && !t.completed);
  const upcomingTasks = tasks.filter(t => t.dueDate > today && !t.completed);
  const overdueTasks = tasks.filter(t => t.dueDate < today && !t.completed);

  const stats = getWeeklyStats();

  summary.textContent =
    `Hoy: ${todayTasks.length} 💖 | ` +
    `Semana: ${stats.completedThisWeek}/${stats.createdThisWeek} ✔ | ` +
    `Productividad: ${stats.productivity}% 📊`;

  const totalToday = tasks.filter(t => t.dueDate === today).length;
  const completedToday = tasks.filter(t => t.dueDate === today && t.completed).length;

  progressBar.style.width =
    totalToday > 0 ? (completedToday / totalToday) * 100 + "%" : "0%";

  createSection("🐱 Hoy", todayTasks);
  createSection("📅 Próximas", upcomingTasks);
  createSection("⏰ Vencidas", overdueTasks);

  updateCalendar();
  renderWeeklyChart();
}

function createSection(titleText, taskList) {
  if (!taskList.length) return;

  const section = document.createElement("div");
  section.className = "task-section";

  const h3 = document.createElement("h3");
  h3.textContent = titleText;
  section.appendChild(h3);

  taskList.forEach(task => {

    const div = document.createElement("div");
    div.className = `task priority-${task.priority}`;
    if (task.completed) div.classList.add("completed");

    const header = document.createElement("div");
    header.className = "task-header";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.onchange = () => {
  task.completed = checkbox.checked;
  saveTasks();
  renderTasks();

  if (task.completed) {
    showCompletionAnimation(task.title);
  }
};


    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";
    deleteBtn.onclick = () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    };

    header.appendChild(checkbox);
    header.appendChild(deleteBtn);

    const title = document.createElement("p");
    title.textContent = task.title;

    const date = document.createElement("small");
    date.textContent = task.dueDate;

    div.appendChild(header);
    div.appendChild(title);
    div.appendChild(date);

    section.appendChild(div);
  });

  tasksContainer.appendChild(section);
}

/* ===== CALENDARIOS ===== */
document.addEventListener("DOMContentLoaded", function () {

  const calendarMiniEl = document.getElementById("calendarMini");
  const calendarFullEl = document.getElementById("calendarFull");
  const calendarWrapper = document.getElementById("calendarWrapper");
  const calendarModal = document.getElementById("calendarModal");

  calendarMini = new FullCalendar.Calendar(calendarMiniEl, {
    initialView: "dayGridMonth",
    headerToolbar: false,
    height: 300,
    events: []
  });

  calendarMini.render();

  calendarFull = new FullCalendar.Calendar(calendarFullEl, {
    initialView: "dayGridMonth",
    height: "auto",
    dateClick: function(info) {
      openModal(info.dateStr);
      calendarModal.classList.add("hidden");
    },
    events: []
  });

  calendarWrapper.addEventListener("click", () => {
    calendarModal.classList.remove("hidden");

    setTimeout(() => {
      calendarFull.render();
      calendarFull.updateSize();
    }, 100);
  });

  calendarModal.addEventListener("click", (e) => {
    if (e.target === calendarModal) {
      calendarModal.classList.add("hidden");
    }
  });

  updateCalendar();

   renderTasks();
});

/* ===== ACTUALIZAR EVENTOS ===== */
function updateCalendar() {
  if (!calendarMini || !calendarFull) return;

 const events = tasks
  .filter(task => !task.completed) // 👈 SOLO pendientes
  .map(task => ({
    title: task.title,
    start: task.dueDate,
    color:
      task.priority === "high" ? "#ef4444" :
      task.priority === "medium" ? "#facc15" :
      "#22c55e"
  }));
  calendarMini.removeAllEvents();
  calendarFull.removeAllEvents();

  calendarMini.addEventSource(events);
  calendarFull.addEventSource(events);
}

/* ===== GRÁFICA ===== */
function renderWeeklyChart() {
  const stats = getWeeklyStats();
  const ctx = document.getElementById("weeklyChart");
  if (!ctx) return;

  if (weeklyChart) weeklyChart.destroy();

  weeklyChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Completadas 💖", "Pendientes 🐾"],
      datasets: [{
        data: [
          stats.completedThisWeek,
          stats.createdThisWeek - stats.completedThisWeek
        ],
        backgroundColor: ["#f472b6", "#fbcfe8"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });
}

/* ===== SERVICE WORKER ===== */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
function showCompletionAnimation(title) {

  const message = document.createElement("div");
  message.textContent = `🎉 ¡Tarea completada! 💖\n${title}`;
  
  message.style.position = "fixed";
  message.style.bottom = "40px";
  message.style.left = "50%";
  message.style.transform = "translateX(-50%)";
  message.style.background = "#f472b6";
  message.style.color = "white";
  message.style.padding = "15px 25px";
  message.style.borderRadius = "20px";
  message.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
  message.style.zIndex = "99999";
  message.style.fontSize = "14px";
  message.style.textAlign = "center";
  message.style.animation = "pop 0.4s ease";

  document.body.appendChild(message);

  setTimeout(() => {
    message.remove();
  }, 2000);
}
