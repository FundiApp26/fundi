// ===========================================
// Fundi Landing Page - Main JavaScript
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  document.getElementById('mobile-menu-btn').addEventListener('click', function() {
    document.getElementById('mobile-menu').classList.toggle('hidden');
  });

  // Language dropdown toggle
  const langDropdownBtn = document.getElementById('lang-dropdown-btn');
  const langDropdown = document.getElementById('lang-dropdown');

  langDropdownBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    langDropdown.classList.toggle('hidden');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function() {
    langDropdown.classList.add('hidden');
  });

  // Update language display
  function updateLangDisplay() {
    const currentLang = localStorage.getItem('fundi-lang') || 'fr';
    document.getElementById('current-lang').textContent = currentLang.toUpperCase();
  }
  updateLangDisplay();

  // FAQ accordion
  document.querySelectorAll('.faq-toggle').forEach(button => {
    button.addEventListener('click', function() {
      const faqItem = this.closest('.faq-item');
      const content = this.nextElementSibling;
      const icon = this.querySelector('.faq-icon');
      const question = this.querySelector('.faq-question');
      const isOpen = !content.classList.contains('hidden');

      // Close all other FAQ items first
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
          item.querySelector('.faq-content').classList.add('hidden');
          item.querySelector('.faq-icon').textContent = '+';
          item.querySelector('.faq-question').classList.remove('text-fundi-green');
          item.querySelector('.faq-question').classList.add('text-fundi-dark');
        }
      });

      // Toggle current item
      if (isOpen) {
        content.classList.add('hidden');
        icon.textContent = '+';
        question.classList.remove('text-fundi-green');
        question.classList.add('text-fundi-dark');
      } else {
        content.classList.remove('hidden');
        icon.textContent = '-';
        question.classList.remove('text-fundi-dark');
        question.classList.add('text-fundi-green');
      }
    });
  });

  // Contact form submission with mailto
  const contactForm = document.getElementById('contact-form');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('contact-message').value;

    const subject = encodeURIComponent('Question Fundi - ' + name);
    const body = encodeURIComponent('Nom: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message);

    window.location.href = 'mailto:fundiapp26@gmail.com?subject=' + subject + '&body=' + body;
  });

  // Scroll animations with Intersection Observer
  const animatedElements = document.querySelectorAll('.animate-on-scroll, .animate-from-left, .animate-from-right, .animate-scale');

  const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  };

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => {
    // Check if element is already in viewport on page load
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    } else {
      animationObserver.observe(el);
    }
  });

  // Navbar shrink on scroll
  const navbar = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Active section detection
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  function setActiveNav(sectionId) {
    navLinks.forEach(link => {
      const indicator = link.querySelector('.nav-indicator');

      if (link.dataset.section === sectionId) {
        // Activate this link
        link.classList.remove('text-white', 'font-normal');
        link.classList.add('text-fundi-orange-light', 'font-bold', 'active');

        // Add indicator if not present
        if (!indicator) {
          const newIndicator = document.createElement('span');
          newIndicator.className = 'nav-indicator absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-fundi-orange-light rounded-full';
          link.appendChild(newIndicator);
        }
      } else {
        // Deactivate this link
        link.classList.remove('text-fundi-orange-light', 'font-bold', 'active');
        link.classList.add('text-white', 'font-normal');

        // Remove indicator if present
        if (indicator) {
          indicator.remove();
        }
      }
    });
  }

  // Intersection Observer for scroll detection
  const navObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveNav(entry.target.id);
      }
    });
  }, navObserverOptions);

  sections.forEach(section => {
    navObserver.observe(section);
  });

  // Also update on click
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const sectionId = this.dataset.section;
      setActiveNav(sectionId);
    });
  });
});

// Global function for language dropdown (called from onclick)
function closeLangDropdown() {
  document.getElementById('lang-dropdown').classList.add('hidden');
}
