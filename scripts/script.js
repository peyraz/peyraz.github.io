const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('playPause');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progressContainer');
const timeDisplay = document.getElementById('timeDisplay');
const volumeSlider = document.getElementById('volumeSlider');

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

// Remove segments functionality since it's causing errors
// let segments = Array.from(tekst.querySelectorAll('.segment')).map((el, i, all) => {
//     const start = parseFloat(el.dataset.start);
//     const end = parseFloat(el.dataset.end);
//     const top = el.offsetTop;
//     const nextTop = (i + 1 < all.length) ? all[i+1].offsetTop : tekst.scrollHeight - container.clientHeight;
//     return { el, start, end, scrollStart: top, scrollEnd: nextTop };
//   });

audio.addEventListener('timeupdate', updateProgress);

function updateProgress() {
  if (audio.duration) {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = percent + '%';
    timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
  }
}

// Remove jump functionality since it depends on segments
// document.querySelectorAll('.jump').forEach(btn => {
//   btn.addEventListener('click', () => {
//     const time = parseFloat(btn.dataset.time);
//     audio.currentTime = time;
//     audio.play();
//   });
// });

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

playPauseBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    playPauseBtn.src = "images/pause.png";
    playPauseBtn.alt = "Pause"
  } else {
    audio.pause();
    playPauseBtn.src = "images/play.png";
    playPauseBtn.alt = "Play"
  }
});

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