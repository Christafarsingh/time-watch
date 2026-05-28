// script.js
// Modern Stopwatch Logic
// Uses requestAnimationFrame for smooth timing and displays minutes:seconds.hundredths

// Grab UI elements
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const clearLapsBtn = document.getElementById('clearLapsBtn');
const lapsList = document.getElementById('lapsList');

let startTimestamp = null; // Timestamp when timer was started/resumed
let elapsed = 0; // Accumulated elapsed time in ms
let rafId = null; // requestAnimationFrame ID
let lapCount = 0;

// Helper: format time as MM:SS.HH (hundredths)
function formatTime(ms) {
  const totalHundredths = Math.floor(ms / 10);
  const minutes = Math.floor(totalHundredths / 6000);
  const seconds = Math.floor((totalHundredths % 6000) / 100);
  const hundredths = totalHundredths % 100;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  const hh = String(hundredths).padStart(2, '0');
  return `${mm}:${ss}.${hh}`;
}

function updateTimer() {
  const now = performance.now();
  const delta = now - startTimestamp;
  const totalElapsed = elapsed + delta;
  timerDisplay.textContent = formatTime(totalElapsed);
  rafId = requestAnimationFrame(updateTimer);
}

function startTimer() {
  startTimestamp = performance.now();
  rafId = requestAnimationFrame(updateTimer);
  // UI state
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  resetBtn.disabled = false;
  lapBtn.disabled = false;
  clearLapsBtn.disabled = false;
}

function pauseTimer() {
  cancelAnimationFrame(rafId);
  const now = performance.now();
  elapsed += now - startTimestamp;
  // UI state
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  // keep reset and lap enabled
}

function resetTimer() {
  cancelAnimationFrame(rafId);
  startTimestamp = null;
  elapsed = 0;
  timerDisplay.textContent = '00:00.00';
  // Reset UI buttons
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  resetBtn.disabled = true;
  lapBtn.disabled = true;
  clearLapsBtn.disabled = true;
  // Clear laps
  lapsList.innerHTML = '';
  lapCount = 0;
}

function recordLap() {
  lapCount += 1;
  const lapTime = timerDisplay.textContent;
  const li = document.createElement('li');
  li.textContent = `Lap ${lapCount}: ${lapTime}`;
  lapsList.prepend(li); // newest on top
}

function clearLaps() {
  lapsList.innerHTML = '';
  lapCount = 0;
}

// Attach event listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
lapBtn.addEventListener('click', recordLap);
clearLapsBtn.addEventListener('click', clearLaps);

// Initial UI state (in case HTML default attributes differ)
resetTimer(); // set proper disabled states without clearing display
