* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: sans-serif;
  background: #fffafc;
  color: #444;
  max-width: 430px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 30px;
  overflow-x: hidden;
  box-shadow: 0 0 40px rgba(0,0,0,0.15);
  transition: background 0.3s ease, color 0.3s ease;
}

.app {
  padding: 20px;
  padding-bottom: 110px;
}

h1 {
  text-align: center;
  color: #f472b6;
}

h2 {
  margin-top: 30px;
}

#summary {
  text-align: center;
  margin-bottom: 15px;
  font-weight: bold;
}

/* ========================= */
/* TAREAS PREMIUM */
/* ========================= */

.task {
  background: linear-gradient(135deg, #fbcfe8, #f9a8d4);
  padding: 15px;
  border-radius: 18px;
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 10px 25px rgba(236,72,153,0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: fadeTask 0.3s ease;
}

.task:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 35px rgba(236,72,153,0.25);
}

.task.completed {
  background: linear-gradient(135deg, #bbf7d0, #86efac);
  text-decoration: line-through;
}

.priority-high { border-left: 5px solid #ef4444; }
.priority-medium { border-left: 5px solid #facc15; }
.priority-low { border-left: 5px solid #22c55e; }

/* ========================= */
/* BOTÓN FLOTANTE */
/* ========================= */

.floating-btn {
  position: fixed;
  bottom: 80px;
  right: 20px;
  background: linear-gradient(135deg, #f472b6, #ec4899);
  color: white;
  border: none;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  font-size: 30px;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(236,72,153,0.4);
  transition: transform 0.2s ease;
  z-index: 50;
}

.floating-btn:hover {
  transform: scale(1.1);
}

/* ========================= */
/* PROGRESS BAR */
/* ========================= */

#progressBarContainer {
  height: 12px;
  background: #fce7f3;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 25px;
}

#progressBar {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #f472b6, #ec4899);
  border-radius: 20px;
  transition: width 0.4s ease;
}

/* ========================= */
/* CALENDARIO */
/* ========================= */

#calendarWrapper {
  background: linear-gradient(135deg, #ffffff, #ffe4f1);
  padding: 15px;
  border-radius: 25px;
  box-shadow: 0 15px 35px rgba(236,72,153,0.15);
  margin-bottom: 25px;
  transition: transform 0.2s ease;
}

#calendarWrapper:hover {
  transform: translateY(-3px);
}

#calendarMini {
  height: 300px;
}

/* ========================= */
/* DASHBOARD */
/* ========================= */

canvas {
  background: linear-gradient(135deg, #ffffff, #ffe4f1);
  border-radius: 25px;
  padding: 15px;
  box-shadow: 0 15px 35px rgba(236,72,153,0.15);
}

/* ========================= */
/* MODAL */
/* ========================= */

.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  background: linear-gradient(135deg, #ffffff, #ffe4f1);
  padding: 25px;
  border-radius: 20px;
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  animation: slideUp 0.25s ease;
}

.modal-content h2 {
  margin: 0;
  color: #db2777;
  text-align: center;
}

.modal-content input,
.modal-content select {
  padding: 12px;
  border-radius: 12px;
  border: none;
  background: #fff;
  font-size: 14px;
  box-shadow: inset 0 0 0 1px #f9a8d4;
  transition: all 0.2s ease;
}

.modal-content input:focus,
.modal-content select:focus {
  outline: none;
  box-shadow: 0 0 0 2px #f472b6;
}

#saveTaskBtn {
  background: linear-gradient(135deg, #f472b6, #ec4899);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

#saveTaskBtn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(236,72,153,0.4);
}

.hidden { display: none; }

/* ========================= */
/* BARRA INFERIOR */
/* ========================= */

.bottom-nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 430px;
  display: flex;
  justify-content: space-around;
  background: linear-gradient(135deg, #ffffff, #ffe4f1);
  padding: 12px;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  box-shadow: 0 -5px 20px rgba(236,72,153,0.15);
}

.bottom-nav button {
  border: none;
  background: none;
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.bottom-nav button:hover {
  transform: scale(1.2);
}

/* ========================= */
/* DARK MODE */
/* ========================= */

.dark-mode {
  background: #1e1e1e;
  color: white;
}

.dark-mode .task {
  background: linear-gradient(135deg, #2c2c2c, #3a2c3f);
}

.dark-mode #calendarWrapper,
.dark-mode canvas,
.dark-mode .bottom-nav {
  background: linear-gradient(135deg, #2a1f2c, #3a2c3f);
}

.dark-mode .modal-content {
  background: linear-gradient(135deg, #2a1f2c, #3a2c3f);
  color: white;
}

.dark-mode .modal-content input,
.dark-mode .modal-content select {
  background: #1e1e1e;
  color: white;
  box-shadow: inset 0 0 0 1px #555;
}

.dark-mode .fc {
  color: white !important;
}

.dark-mode .fc-daygrid-day-number,
.dark-mode .fc-col-header-cell-cushion {
  color: white !important;
}

/* ========================= */
/* ANIMACIONES */
/* ========================= */

@keyframes fadeTask {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
