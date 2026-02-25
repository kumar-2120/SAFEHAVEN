// SAFEHAVEN – script.js

// ── Quick Exit button ──────────────────────────────────────────────────────
// Instantly navigates to a neutral site and clears history so browsing
// history is not easily accessible.
document.getElementById('quick-exit-btn').addEventListener('click', () => {
  window.location.replace('https://www.google.com');
});

// Also bind keyboard shortcut: pressing Escape three times exits quickly
let escCount = 0;
let escTimer;
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    escCount++;
    clearTimeout(escTimer);
    escTimer = setTimeout(() => { escCount = 0; }, 1500);
    if (escCount >= 3) {
      window.location.replace('https://www.google.com');
    }
  }
});

// ── Contact / Help form ────────────────────────────────────────────────────
const helpForm = document.getElementById('help-form');
if (helpForm) {
  helpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // In a real deployment this would POST to a secure back-end.
    // Here we show a success message and reset the form.
    helpForm.reset();
    const successMsg = document.getElementById('form-success');
    if (successMsg) {
      successMsg.style.display = 'block';
      successMsg.focus();
      setTimeout(() => { successMsg.style.display = 'none'; }, 6000);
    }
  });
}

// ── Smooth-scroll for nav links ────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
