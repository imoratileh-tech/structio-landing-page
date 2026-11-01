/**
 * STRUCTIO® — Minimal Editorial Navigation & Responsive Drawer
 */

(function () {
  'use strict';

  function initNavigation() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');
    const drawerLinks = document.querySelectorAll('.mobile-nav-link');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Mobile Drawer Open / Close
    function openDrawer() {
      if (!mobileDrawer) return;
      mobileDrawer.classList.add('open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      if (mobileToggle) {
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
      document.body.style.overflow = 'hidden';
      if (drawerCloseBtn) drawerCloseBtn.focus();
    }

    function closeDrawer() {
      if (!mobileDrawer) return;
      mobileDrawer.classList.remove('open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      if (mobileToggle) {
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';
      if (mobileToggle) mobileToggle.focus();
    }

    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => {
        if (mobileDrawer.classList.contains('open')) {
          closeDrawer();
        } else {
          openDrawer();
        }
      });
    }

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', closeDrawer);
    }

    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    // Close on Escape Key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
        closeDrawer();
      }
    });

    // Active Section Tracking via Intersection Observer
    if ('IntersectionObserver' in window && sections.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');
            navLinks.forEach(link => {
              if (link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      }, {
        rootMargin: '-30% 0px -60% 0px'
      });

      sections.forEach(sec => observer.observe(sec));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
  } else {
    initNavigation();
  }
})();
