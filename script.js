// SAFEHAVEN – script.js

// ── Backend API base URL ───────────────────────────────────────────────────
// Update this if the Spring Boot server runs on a different host/port.
const API_BASE = 'http://localhost:8080/api';

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
  helpForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = helpForm.querySelector('.btn-submit');
    const successMsg = document.getElementById('form-success');
    const errorMsg = document.getElementById('form-error');

    // Collect form values
    const payload = {
      name:          helpForm.querySelector('#name').value.trim(),
      contactMethod: helpForm.querySelector('#contact-method').value,
      contactInfo:   helpForm.querySelector('#contact-info').value.trim(),
      message:       helpForm.querySelector('#message').value.trim(),
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const response = await fetch(`${API_BASE}/contact`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        helpForm.reset();
        if (successMsg) {
          successMsg.style.display = 'block';
          successMsg.focus();
          setTimeout(() => { successMsg.style.display = 'none'; }, 8000);
        }
        if (errorMsg) errorMsg.style.display = 'none';
      } else {
        throw new Error(data.message || 'Submission failed.');
      }
    } catch (err) {
      if (errorMsg) {
        errorMsg.textContent = err.message || 'Could not send your message. Please try calling a hotline directly.';
        errorMsg.style.display = 'block';
        setTimeout(() => { errorMsg.style.display = 'none'; }, 8000);
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
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
