// ===========================
// Screen Elements
// ===========================
const screenName = document.getElementById('screen-name');
const screenGreeting = document.getElementById('screen-greeting');
const screenMood = document.getElementById('screen-mood');
const nameInput = document.getElementById('name-input');
const btnEnter = document.getElementById('btn-enter');
const greetingText = document.getElementById('greeting-text');
const moodLog = document.getElementById('mood-log');
const moodLogEntries = document.getElementById('mood-log-entries');
const chaosMeter = document.getElementById('chaos-meter');
const chaosMeterFill = document.getElementById('chaos-meter-fill');
const chaosMeterPct = document.getElementById('chaos-meter-pct');

// ===========================
// Name Entry Flow
// ===========================
function handleEnter() {
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.focus();
    return;
  }

  // Fade out the name screen
  screenName.classList.add('fade-out');

  setTimeout(() => {
    screenName.classList.add('hidden');
    screenName.classList.remove('fade-out');

    // Show greeting
    greetingText.textContent = `Hey there! ${name}!`;
    screenGreeting.classList.remove('hidden');
    screenGreeting.classList.add('fade-in');

    // After 3 seconds, transition to mood screen
    setTimeout(() => {
      screenGreeting.classList.add('fade-out');

      setTimeout(() => {
        screenGreeting.classList.add('hidden');
        screenGreeting.classList.remove('fade-out', 'fade-in');

        // Show mood selection
        screenMood.classList.remove('hidden');
        screenMood.classList.add('fade-in');

        // Show mood log panel and chaos meter
        moodLog.classList.remove('hidden');
        chaosMeter.classList.remove('hidden');

        // Remove fade-in class after animation completes so
        // theme animations (e.g. chaosWobble) don't conflict
        screenMood.addEventListener('animationend', () => {
          screenMood.classList.remove('fade-in');
        }, { once: true });
      }, 600);
    }, 3000);
  }, 600);
}

btnEnter.addEventListener('click', handleEnter);

// Allow pressing Enter key to submit
nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleEnter();
});

// ===========================
// Theme Switching Logic
// ===========================
const THEMES = ['productive', 'chill', 'chaos'];

const buttons = {
  productive: document.getElementById('btn-productive'),
  chill: document.getElementById('btn-chill'),
  chaos: document.getElementById('btn-chaos'),
};

// ===========================
// Floating Emoji System
// ===========================
let emojiInterval = null;

function spawnEmoji(emoji) {
  const el = document.createElement('span');
  el.classList.add('floating-emoji');
  el.textContent = emoji;

  // Random position across the viewport
  el.style.left = Math.random() * 90 + 5 + '%';
  el.style.top = Math.random() * 80 + 10 + '%';

  // Slight size variation
  const size = 1.5 + Math.random() * 1.5;
  el.style.fontSize = size + 'rem';

  document.body.appendChild(el);

  // Remove from DOM after animation ends
  el.addEventListener('animationend', () => el.remove());
}

function startEmojiSpawner(emoji, intervalMs) {
  stopEmojiSpawner();
  spawnEmoji(emoji);
  emojiInterval = setInterval(() => spawnEmoji(emoji), intervalMs);
}

function stopEmojiSpawner() {
  if (emojiInterval) {
    clearInterval(emojiInterval);
    emojiInterval = null;
  }
}

// ===========================
// Floating Quotes System (Chaos)
// ===========================
const CHAOS_QUOTES = [
  'EMBRACE THE CHAOS',
  'CHAOS IS HERE',
  'EVERYTHING IS CHAOTIC!',
  'THE CHAOS IS COMING',
  'CHAOS.'
];

let quoteInterval = null;

function spawnQuote() {
  const el = document.createElement('span');
  el.classList.add('floating-quote');
  el.textContent = CHAOS_QUOTES[Math.floor(Math.random() * CHAOS_QUOTES.length)];

  // Random position
  el.style.left = Math.random() * 80 + 5 + '%';
  el.style.top = Math.random() * 80 + 5 + '%';

  // Random size variation
  const size = 0.75 + Math.random() * 0.8;
  el.style.fontSize = size + 'rem';

  // Random color between red, purple, and orange tones
  const colors = [
    'rgba(255, 68, 102, 0.5)',
    'rgba(204, 68, 255, 0.4)',
    'rgba(255, 136, 0, 0.4)',
    'rgba(255, 0, 85, 0.4)',
    'rgba(150, 50, 255, 0.45)'
  ];
  el.style.color = colors[Math.floor(Math.random() * colors.length)];

  document.body.appendChild(el);

  el.addEventListener('animationend', () => el.remove());
}

function startQuoteSpawner(intervalMs) {
  stopQuoteSpawner();
  spawnQuote();
  quoteInterval = setInterval(() => spawnQuote(), intervalMs);
}

function stopQuoteSpawner() {
  if (quoteInterval) {
    clearInterval(quoteInterval);
    quoteInterval = null;
  }
}

// ===========================
// Mood Log
// ===========================
const MOOD_EMOJIS = {
  productive: '😎',
  chill: '😌',
  chaos: '😈'
};

const MOOD_LABELS = {
  productive: 'Productive',
  chill: 'Chill',
  chaos: 'Chaos'
};

function addLogEntry(theme) {
  const entry = document.createElement('div');
  entry.classList.add('mood-log-entry');

  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  entry.innerHTML = `
    <span class="log-emoji">${MOOD_EMOJIS[theme]}</span>
    <span class="log-text">${MOOD_LABELS[theme]}</span>
    <span class="log-time">${time}</span>
  `;

  moodLogEntries.appendChild(entry);

  // Auto-scroll to bottom
  moodLogEntries.scrollTop = moodLogEntries.scrollHeight;
}

// ===========================
// Theme Application
// ===========================
function setTheme(theme) {
  // Remove all theme classes from body
  THEMES.forEach(t => document.body.classList.remove(t));

  // Remove active state from all buttons
  Object.values(buttons).forEach(btn => btn.classList.remove('active'));

  // Stop all running effects
  stopEmojiSpawner();
  stopQuoteSpawner();

  // Apply the selected theme
  if (theme) {
    document.body.classList.add(theme);
    buttons[theme].classList.add('active');
  }

  // Theme-specific effects
  if (theme === 'productive') {
    startEmojiSpawner('😎', 800);
  } else if (theme === 'chill') {
    startEmojiSpawner('😌', 1200);
  } else if (theme === 'chaos') {
    startEmojiSpawner('😈', 600);
    startQuoteSpawner(1400);
  }

  // Add to mood log
  if (theme) {
    addLogEntry(theme);
  }

  // Increment chaos meter
  if (theme === 'chaos') {
    updateChaosMeter();
  }
}

// ===========================
// Chaos Meter
// ===========================
let chaosLevel = 0;
const btnReset = document.getElementById('btn-reset');

function updateChaosMeter() {
  if (chaosLevel >= 100) return;
  chaosLevel = Math.min(chaosLevel + 5, 100);
  chaosMeterFill.style.height = chaosLevel + '%';
  chaosMeterPct.textContent = chaosLevel + '%';

  // Check for explosion
  if (chaosLevel >= 100) {
    triggerExplosion();
  }
}

// ===========================
// Explosion (100% Chaos)
// ===========================
function triggerExplosion() {
  // Stop all effects
  stopEmojiSpawner();
  stopQuoteSpawner();

  // Add explosion class to body
  document.body.classList.add('exploded');

  // Show reset button
  btnReset.classList.remove('hidden');
}

function resetApp() {
  // Remove explosion
  document.body.classList.remove('exploded');

  // Remove all theme classes
  THEMES.forEach(t => document.body.classList.remove(t));

  // Remove active states
  Object.values(buttons).forEach(btn => btn.classList.remove('active'));

  // Stop all effects
  stopEmojiSpawner();
  stopQuoteSpawner();

  // Reset chaos meter
  chaosLevel = 0;
  chaosMeterFill.style.height = '0%';
  chaosMeterPct.textContent = '0%';

  // Hide reset button
  btnReset.classList.add('hidden');

  // Clear floating emojis and quotes from DOM
  document.querySelectorAll('.floating-emoji, .floating-quote').forEach(el => el.remove());
}

// Attach click listeners
buttons.productive.addEventListener('click', () => setTheme('productive'));
buttons.chill.addEventListener('click', () => setTheme('chill'));
buttons.chaos.addEventListener('click', () => setTheme('chaos'));
btnReset.addEventListener('click', resetApp);
