/**
 * STRUCTIO® — Main Application Controller
 * Consultation Form Routing
 */

(function () {
  'use strict';

  function initApp() {
    setupConsultationActions();
    setupConsultationForm();
  }

  function setupConsultationActions() {
    const openBtns = document.querySelectorAll('[data-open-consultation]');
    const consultation = document.getElementById('consultation');
    if (!consultation) return;

    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const scrollBehavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = 'auto';
        consultation.scrollIntoView({ block: 'start', behavior: 'auto' });
        document.documentElement.style.scrollBehavior = scrollBehavior;
      });
    });
  }

  function setupConsultationForm() {
    const form = document.getElementById('direct-consultation-form');
    const status = document.getElementById('consultation-form-status');
    const submitButton = form && form.querySelector('button[type="submit"]');
    const submitLabel = submitButton && submitButton.querySelector('.submit-label');

    if (!form || !status || !submitButton || !submitLabel) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      status.textContent = '';
      status.classList.remove('is-error', 'is-success');
      submitButton.disabled = true;
      submitLabel.textContent = 'Sending request...';

      const payload = Object.fromEntries(new FormData(form).entries());

      try {
        const result = await fetch('/api/consultation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const response = await result.json();

        if (!result.ok || !response.ok) {
          throw new Error(response.error || 'We could not send your request. Please try again.');
        }

        window.location.assign('/thank-you.html');
      } catch (error) {
        status.textContent = error.message || 'We could not send your request. Please try again or email info@structio.com.';
        status.classList.add('is-error');
        submitButton.disabled = false;
        submitLabel.textContent = 'Send consultation request';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
