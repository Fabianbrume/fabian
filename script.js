/**
 * ============================================================================
 * PORTFOLIO JAVASCRIPT
 * Developer: Alex Rivera
 * Description: Clean, accessible Vanilla JS for mobile navigation, scroll 
 *              spy, contact form validation, theme toggle, and micro-interactions.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Elements Selection
  // --------------------------------------------------------------------------
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navOverlay = document.getElementById('nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('back-to-top');
  const themeToggleBtn = document.getElementById('theme-toggle');
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('submit-btn');
  const currentYearSpan = document.getElementById('current-year');

  // --------------------------------------------------------------------------
  // 2. Dynamic Copyright Year
  // --------------------------------------------------------------------------
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 3. Theme Toggle (Light / Dark Mode)
  // --------------------------------------------------------------------------
  const THEME_STORAGE_KEY = 'alex_rivera_theme';

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
      themeToggleBtn.setAttribute('title', 'Switch to light theme');
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
      themeToggleBtn.setAttribute('title', 'Switch to dark theme');
    }
  };

  // Initialize theme from localStorage, default is light
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const newTheme = isDark ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    });
  }

  // --------------------------------------------------------------------------
  // 4. Mobile Navigation & Hamburger Menu
  // --------------------------------------------------------------------------
  const openMobileMenu = () => {
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('open');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeMobileMenu = () => {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close when overlay is clicked
    if (navOverlay) {
      navOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          closeMobileMenu();
        }
      });
    });

    // Close when pressing Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });

    // Auto-close if window is resized above mobile breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. Sticky Header & Back to Top Button on Scroll
  // --------------------------------------------------------------------------
  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;

    // Sticky header shadow
    if (header) {
      if (scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 6. Active Navigation Link Indicator (Scroll Spy)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  const updateActiveNavLink = () => {
    const scrollPosition = window.scrollY + 120; // Offset for header

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // --------------------------------------------------------------------------
  // 7. Contact Form Client-Side Validation
  // --------------------------------------------------------------------------
  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    // Email regex according to HTML5 standard
    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    // Helper to display an error on a field
    const setFieldError = (input, errorMsg) => {
      const group = input.closest('.form-group');
      const errorElement = group.querySelector('.form-error-msg');
      group.classList.add('has-error');
      group.classList.remove('is-valid');
      if (errorElement) {
        errorElement.textContent = errorMsg;
      }
      input.setAttribute('aria-invalid', 'true');
    };

    // Helper to clear error state on a field
    const clearFieldError = (input) => {
      const group = input.closest('.form-group');
      const errorElement = group.querySelector('.form-error-msg');
      group.classList.remove('has-error');
      group.classList.add('is-valid');
      if (errorElement) {
        errorElement.textContent = '';
      }
      input.removeAttribute('aria-invalid');
    };

    // Validation rules
    const validateField = (input) => {
      const value = input.value.trim();

      if (input === nameInput) {
        if (!value) {
          setFieldError(input, 'Please enter your full name.');
          return false;
        }
        if (value.length < 2) {
          setFieldError(input, 'Name must be at least 2 characters.');
          return false;
        }
        clearFieldError(input);
        return true;
      }

      if (input === emailInput) {
        if (!value) {
          setFieldError(input, 'Please enter your email address.');
          return false;
        }
        if (!emailPattern.test(value)) {
          setFieldError(input, 'Please enter a valid email address (e.g. name@example.com).');
          return false;
        }
        clearFieldError(input);
        return true;
      }

      if (input === subjectInput) {
        if (!value) {
          setFieldError(input, 'Please enter a subject.');
          return false;
        }
        if (value.length < 3) {
          setFieldError(input, 'Subject must be at least 3 characters.');
          return false;
        }
        clearFieldError(input);
        return true;
      }

      if (input === messageInput) {
        if (!value) {
          setFieldError(input, 'Please write your message.');
          return false;
        }
        if (value.length < 10) {
          setFieldError(input, 'Message must be at least 10 characters long.');
          return false;
        }
        clearFieldError(input);
        return true;
      }

      return true;
    };

    // Live validation as the user types/changes inputs
    [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
      if (input) {
        input.addEventListener('input', () => {
          const group = input.closest('.form-group');
          if (group.classList.contains('has-error')) {
            validateField(input);
          }
        });

        input.addEventListener('blur', () => {
          if (input.value.trim().length > 0) {
            validateField(input);
          }
        });
      }
    });

    // Form submission handler
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      // Reset feedback display
      formFeedback.className = 'form-feedback';
      formFeedback.textContent = '';

      // Validate all fields
      const isNameValid = validateField(nameInput);
      const isEmailValid = validateField(emailInput);
      const isSubjectValid = validateField(subjectInput);
      const isMessageValid = validateField(messageInput);

      const isFormValid = isNameValid && isEmailValid && isSubjectValid && isMessageValid;

      if (!isFormValid) {
        // Focus the first invalid input
        const firstErrorInput = contactForm.querySelector('.has-error .form-input');
        if (firstErrorInput) {
          firstErrorInput.focus();
        }

        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please correct the highlighted fields before submitting.';
        return;
      }

      // Simulation of form submission
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span>Sending...</span>
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;

        // Display professional feedback message informing user
        formFeedback.className = 'form-feedback success';
        formFeedback.innerHTML = `
          <strong>Thank you, ${escapeHtml(nameInput.value.trim())}!</strong> Your message has been validated successfully.<br>
          <span style="display:block; margin-top:0.4rem; font-size:0.85rem; opacity:0.9;">
            <em>Note: This is a frontend portfolio demonstration. To receive live emails, connect this form to an email service (such as Formspree, Resend, or EmailJS) or your custom backend server.</em>
          </span>
        `;

        // Clear input values and validation classes
        contactForm.reset();
        [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
          const group = input.closest('.form-group');
          group.classList.remove('is-valid');
          group.classList.remove('has-error');
        });
      }, 600);
    });
  }

  // --------------------------------------------------------------------------
  // 8. Helper Functions
  // --------------------------------------------------------------------------
  function escapeHtml(string) {
    const div = document.createElement('div');
    div.textContent = string;
    return div.innerHTML;
  }
});
