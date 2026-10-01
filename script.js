/* ================================================
   WESTERN WORLD VISA SERVICES — script.js
   Handles: navbar scroll, mobile menu, particles,
            counter animation, reveal on scroll,
            course tabs, FAQ accordion
   ================================================ */

(function () {
  'use strict';

  // ─── NAVBAR ───
  const navbar = document.getElementById('navbar');
  const burgerBtn = document.getElementById('burgerBtn');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burgerBtn.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Mobile sub-menu toggle
  document.querySelectorAll('.has-sub > a').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        link.closest('.has-sub').classList.toggle('open');
      }
    });
  });

  // ─── PARTICLES ───
  const particleContainer = document.getElementById('particles');
  if (particleContainer) {
    const count = 18;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 14 + 4;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        animation-duration: ${Math.random() * 18 + 10}s;
        animation-delay: ${Math.random() * -20}s;
        opacity: ${Math.random() * 0.4 + 0.1};
      `;
      particleContainer.appendChild(p);
    }
  }

  // ─── SCROLL REVEAL ───
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));

  // ─── COUNTER ANIMATION ───
  function animateCounter(el, target, duration = 1600) {
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  // ─── COURSE TABS ───
  const tabs = document.querySelectorAll('.courses__tabs .tab');
  const panels = document.querySelectorAll('.courses__panels .panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const activePanel = document.getElementById('tab-' + target);
      if (activePanel) {
        activePanel.classList.add('active');
        // Re-trigger reveal for newly shown cards
        activePanel.querySelectorAll('.reveal').forEach(el => {
          el.classList.remove('visible');
          setTimeout(() => observer.observe(el), 30);
        });
      }
    });
  });

  // ─── FAQ ACCORDION ───
  document.querySelectorAll('.faq__q').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      // Close all
      document.querySelectorAll('.faq__q').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('open');
      });
      // Toggle clicked
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        btn.nextElementSibling.classList.add('open');
      }
    });
  });

  // ─── CONTACT FORM ───
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      const original = btn.textContent;

      // Basic validation
      const name = contactForm.querySelector('#name').value.trim();
      const email = contactForm.querySelector('#email').value.trim();
      const phone = contactForm.querySelector('#phone').value.trim();

      if (!name || !email || !phone) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
      }

      btn.textContent = 'Sending…';
      btn.disabled = true;

      // Simulate send (replace with real endpoint)
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        contactForm.reset();
        showToast('Message sent! We\'ll get back to you within 2 hours.', 'success');
      }, 1400);
    });
  }

  // ─── TOAST ───
  function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast toast--' + type;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 90px;
      right: 24px;
      z-index: 9999;
      background: ${type === 'success' ? '#0D1F3C' : '#c0392b'};
      color: #fff;
      padding: 14px 22px;
      border-radius: 8px;
      font-size: .9rem;
      font-weight: 500;
      box-shadow: 0 8px 28px rgba(0,0,0,.22);
      max-width: 320px;
      line-height: 1.4;
      transform: translateY(12px);
      opacity: 0;
      transition: all .3s ease;
    `;

    if (type === 'success') {
      toast.style.borderLeft = '4px solid #C8972B';
    }

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
      });
    });

    setTimeout(() => {
      toast.style.transform = 'translateY(12px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  // ─── ACTIVE NAV LINK ON SCROLL ───
  const sections = document.querySelectorAll('section[id], div[id]');
  const navItems = document.querySelectorAll('.navbar__links > li > a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navItems.forEach(a => {
          a.closest('li').classList.remove('active');
          if (a.getAttribute('href') === '#' + id) {
            a.closest('li').classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => sectionObserver.observe(s));

})();
