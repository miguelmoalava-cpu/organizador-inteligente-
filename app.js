let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let points = parseInt(localStorage.getItem("points")) || 0;
let streak = parseInt(localStorage.getItem("streak")) || 0;
let lastCompletedDay = localStorage.getItem("lastCompletedDay") || null;

const OPENAI_API_KEY = "sk-...fY0A";

const container = document.getElementById("tasksContainer");
const modal = document.getElementById("modal");
const addBtn = document.getElementById("addTaskBtn");
const saveBtn = document.getElementById("saveTaskBtn");
const progressBar = document.getElementById("progressBar");
const summary = document.getElementById("summary");

let editingTaskId = null;

addBtn.onclick = () => {
  editingTaskId = null;
  document.getElementById("modalTitle").innerText = "Nueva tarea ✨";
  modal.classList.remove("hidden");
};

saveBtn.onclick = saveTask;

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
  titleInput.value = "";
  editingTaskId = null;
  render();
}

function render() {
  container.innerHTML = "";
  const today = new Date().toISOString().split("T")[0];

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
  updateChart();
}

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

  lanzarConfetti();
  showCompleteAnimation();
  render();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  editingTaskId = id;
  document.getElementById("modalTitle").innerText = "Editar tarea ✏️";
  document.getElementById("taskTitle").value = task.title;
  document.getElementById("taskDateTime").value = task.date;
  document.getElementById("taskPriority").value = task.priority;
  modal.classList.remove("hidden");
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  render();
}

function lanzarConfetti() {
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 }
  });
}

function showCompleteAnimation() {
  const popup = document.createElement("div");
  popup.className = "complete-popup";
  popup.innerText = "✨ ¡Tarea completada! +10 pts";
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 2000);
}

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

    return tomorrow.toISOString().slice(0,16);
  }

  return null;
}

/* CALENDARIO */

let calendarMini;

document.addEventListener("DOMContentLoaded", () => {
  calendarMini = new FullCalendar.Calendar(
    document.getElementById("calendarMini"),
    {
      initialView: "dayGridMonth",
      height: 300
    }
  );
  calendarMini.render();
  render();
});

function updateCalendar() {
  if (!calendarMini) return;
  calendarMini.removeAllEvents();
  tasks.filter(t => !t.completed).forEach(t => {
    calendarMini.addEvent({
      title: t.title,
      start: t.date,
      color: t.priority === "high" ? "red" :
             t.priority === "medium" ? "orange" : "green"
    });
  });
}

/* CHART */

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

function updateProgress() {
  const completed = tasks.filter(t => t.completed).length;
  const percent = tasks.length === 0 ? 0 : (completed / tasks.length) * 100;
  progressBar.style.width = percent + "%";
  summary.innerText = `⭐ ${points} pts | 🔥 Racha: ${streak} días`;
}

/* IA REAL */

async function reorganizarConIA() {
  if (tasks.length === 0) return alert("No hay tareas");

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Organiza tareas por urgencia y fecha." },
          { role: "user", content: JSON.stringify(tasks) }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    alert(response.data.choices[0].message.content);

  } catch (err) {
    alert("Error conectando IA");
  }
}

/* DARK MODE AUTO */

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
