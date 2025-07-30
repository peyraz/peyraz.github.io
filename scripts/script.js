const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('playPause');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progressContainer');
const timeDisplay = document.getElementById('timeDisplay');
const volumeSlider = document.getElementById('volumeSlider');

const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const overlay = document.querySelector('.overlay');
const closeBtn = document.querySelector('.close-btn');

function openMenu() {
  navLinks.classList.add('open');
  overlay.classList.add('show');
  toggle.style.display = 'none';
}

function closeMenu() {
  navLinks.classList.remove('open');
  overlay.classList.remove('show');
  toggle.style.display = 'block';
}

toggle.addEventListener('click', openMenu);
overlay.addEventListener('click', closeMenu);
closeBtn.addEventListener('click', closeMenu);

const container = document.getElementById('text-container')
const wiersze = Array.from(container.querySelectorAll('[data-start]'))
  .map(el => ({
    time: parseFloat(el.getAttribute('data-start')),
    el
  }))
  .sort((a, b) => a.time - b.time);

let currentIndex = 0;

// Check if elements exist
if (!audio || !playPauseBtn || !progress || !progressContainer || !timeDisplay) {
  console.error('Missing required audio player elements');
  if (timeDisplay) timeDisplay.textContent = 'Player initialization error';
}

// Add error handling for audio
audio.addEventListener('error', () => {
  console.error('Audio loading error:', audio.error);
  if (timeDisplay) timeDisplay.textContent = 'Error loading audio: ' + audio.error.message;
});

// Add loadedmetadata event
audio.addEventListener('loadedmetadata', () => {
  console.log('Audio duration:', audio.duration);
  if (timeDisplay) timeDisplay.textContent = `0:00 / ${formatTime(audio.duration)}`;
});

// Initialize audio source
audio.src = 'resources/biografia edit.wav';
audio.load();


audio.addEventListener('timeupdate', updateProgress);

function updateProgress() {
  if (audio.duration) {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = percent + '%';
    timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
  }
}

audio.addEventListener('timeupdate', () => {
  console.log('Current audio time:', audio.currentTime);
  const t = audio.currentTime;
  
  // Move forward
  while (currentIndex + 1 < wiersze.length && wiersze[currentIndex + 1].time <= t) {
    currentIndex++;
    wiersze[currentIndex].el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  
  // Move backward
  while (currentIndex > 0 && wiersze[currentIndex].time > t) {
    currentIndex--;
    wiersze[currentIndex].el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  console.log('Current index:', currentIndex)
  console.log('Current wiersz time:', wiersze[currentIndex]?.time);

});


function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

playPauseBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
  updatePlayPauseIcon();
});

function updatePlayPauseIcon() {
  if (audio.paused) {
    playPauseBtn.src = "images/play.png";
    playPauseBtn.alt = "Play"
  } else {
    playPauseBtn.src = "images/pause.png";
    playPauseBtn.alt = "Pause"
  }
}

audio.addEventListener('play', updatePlayPauseIcon);
audio.addEventListener('pause', updatePlayPauseIcon);


progressContainer.addEventListener('click', (e) => {
  const rect = progressContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;
  const percent = clickX / width;
  audio.currentTime = percent * audio.duration;
});

volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value;
});

console.log('Container element:', container);
console.log('Found wiersze:', wiersze);
console.log('All wiersze times:', wiersze.map(w => w.time));
