/**
 * Muhammad Ali - Premium Software Engineering Portfolio Core
 * Handles responsive canvas particles, active theme storage, custom cursor tracking,
 * coordinate tracking for cursor background glow overlays, scroll progress bars,
 * project cards filtering, 3D tilt effects, and viewport stats counter increments.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. PRELOADER
     ========================================================================== */
  const preloader = document.getElementById('preloader');
  
  window.addEventListener('load', () => {
    if (preloader) {
      preloader.classList.add('fade-out');
    }
  });

  setTimeout(() => {
    if (preloader && !preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
    }
  }, 2500);


  /* ==========================================================================
     2. MOUSE COORDINATES & BACKGROUND GLOW TRACKER
     ========================================================================== */
  const root = document.documentElement;

  window.addEventListener('mousemove', (e) => {
    // Update CSS variables for radial gradient positioning
    root.style.setProperty('--mouse-x', `${e.clientX}px`);
    root.style.setProperty('--mouse-y', `${e.clientY}px`);
  });


  /* ==========================================================================
     3. SCROLL PROGRESS INDICATOR & HEADER TRANSFORM
     ========================================================================== */
  const scrollProgressBar = document.querySelector('.scroll-progress-bar');
  const header = document.querySelector('header');

  function handleScrollEffects() {
    const scrollY = window.scrollY;
    
    // 3.1 Calculate scroll percentage
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0 && scrollProgressBar) {
      const scrolledPercent = (scrollY / docHeight) * 100;
      scrollProgressBar.style.width = `${scrolledPercent}%`;
    }

    // 3.2 Add shadow and blur to header on scroll
    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }

  window.addEventListener('scroll', handleScrollEffects);
  handleScrollEffects(); // Run once at start


  /* ==========================================================================
     4. THEME TOGGLE (DARK / LIGHT)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const toggleIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
  const body = document.body;

  const savedTheme = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
    body.classList.add('light-theme');
    if (toggleIcon) toggleIcon.className = 'fas fa-sun';
  } else {
    body.classList.remove('light-theme');
    if (toggleIcon) toggleIcon.className = 'fas fa-moon';
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      body.classList.toggle('light-theme');
      const isLight = body.classList.contains('light-theme');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      
      if (toggleIcon) {
        toggleIcon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
      }
    });
  }


  /* ==========================================================================
     5. MOBILE NAV DRAWER MENU
     ========================================================================== */
  const hamburgerMenu = document.getElementById('hamburger-menu');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileMenu() {
    hamburgerMenu.classList.toggle('active');
    mobileMenuOverlay.classList.toggle('active');
    body.classList.toggle('menu-open');
  }

  if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', toggleMobileMenu);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenuOverlay.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  // Close when clicking external area
  document.addEventListener('click', (e) => {
    if (mobileMenuOverlay.classList.contains('active') && 
        !mobileMenuOverlay.contains(e.target) && 
        !hamburgerMenu.contains(e.target)) {
      toggleMobileMenu();
    }
  });


  /* ==========================================================================
     6. CUSTOM CURSOR TRAILER
     ========================================================================== */
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');

  let mouseX = 0;
  let mouseY = 0;
  let outlineX = 0;
  let outlineY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }
  });

  function updateOutlineCursor() {
    const easing = 0.16; // trailing delay multiplier
    outlineX += (mouseX - outlineX) * easing;
    outlineY += (mouseY - outlineY) * easing;

    if (cursorOutline) {
      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;
    }

    requestAnimationFrame(updateOutlineCursor);
  }
  updateOutlineCursor();

  // Attach scaling classes on hoverable nodes
  const hoverables = document.querySelectorAll('a, button, .btn, .project-card, .interest-card, .certificate-card, #hamburger-menu, .filter-btn');
  hoverables.forEach(node => {
    node.addEventListener('mouseenter', () => body.classList.add('cursor-hover'));
    node.addEventListener('mouseleave', () => body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mouseleave', () => {
    if (cursorDot && cursorOutline) {
      cursorDot.style.opacity = '0';
      cursorOutline.style.opacity = '0';
    }
  });

  document.addEventListener('mouseenter', () => {
    if (cursorDot && cursorOutline) {
      cursorDot.style.opacity = '1';
      cursorOutline.style.opacity = '1';
    }
  });


  /* ==========================================================================
     7. TYPING EFFECT
     ========================================================================== */
  const typingSpan = document.querySelector('.typing-text');
  const phrases = ["Software Engineering Student", "Full Stack Developer", "Problem Solver", "AI Enthusiast"];
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingTimer = null;

  function handleTyping() {
    const currentPhrase = phrases[phraseIdx];
    
    if (isDeleting) {
      typingSpan.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typingSpan.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
    }

    let delay = isDeleting ? 30 : 70;

    if (!isDeleting && charIdx === currentPhrase.length) {
      delay = 2200; // Pause after word completes
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 400; // Pause before typing next word
    }

    typingTimer = setTimeout(handleTyping, delay);
  }

  if (typingSpan) {
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.innerHTML = '|';
    typingSpan.parentNode.appendChild(cursor);
    handleTyping();
  }


  /* ==========================================================================
     8. GITHUB CONTRIBUTION CALENDAR MOCK GENERATOR
     ========================================================================== */
  const githubGrid = document.getElementById('github-grid');
  if (githubGrid) {
    const totalTiles = 175; // 7 rows x 25 columns
    
    for (let i = 0; i < totalTiles; i++) {
      const tile = document.createElement('div');
      tile.className = 'github-tile';
      
      // Seed random weights to create realistic contribution densities (skewed towards 0 and 1)
      const rand = Math.random();
      let level = 0;
      if (rand > 0.45 && rand <= 0.7) level = 1;
      else if (rand > 0.7 && rand <= 0.85) level = 2;
      else if (rand > 0.85 && rand <= 0.94) level = 3;
      else if (rand > 0.94) level = 4;
      
      tile.classList.add(`level-${level}`);
      githubGrid.appendChild(tile);
    }
  }


  /* ==========================================================================
     9. 3D CARD TILT EFFECT (VANILLA JAVASCRIPT)
     ========================================================================== */
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate relative to card
      const y = e.clientY - rect.top;  // y coordinate relative to card
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation degree limits
      const maxRotation = 10; // Degrees limit
      const rotateX = ((centerY - y) / centerY) * maxRotation;
      const rotateY = ((x - centerX) / centerX) * maxRotation;
      
      card.classList.remove('reset-transition');
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      // Return card to its origin smoothly
      card.classList.add('reset-transition');
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  });


  /* ==========================================================================
     10. PROJECT TABS FILTERING
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button active classes
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('hide');
          // Simple entry fade animation
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transition = 'opacity 0.4s ease';
          }, 30);
        } else {
          card.classList.add('hide');
        }
      });
    });
  });


  /* ==========================================================================
     11. ANIMATED ACHIEVEMENT COUNTERS
     ========================================================================== */
  const achievementsSection = document.getElementById('achievements');
  const counterNumbers = document.querySelectorAll('.counter-number');
  let countersAnimated = false;

  function animateCounters() {
    counterNumbers.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 1200; // Total counting time in ms
      const stepTime = 15;   // Update frequency in ms
      const steps = duration / stepTime;
      const increment = target / steps;
      
      let currentVal = 0;
      
      const updateNumber = setInterval(() => {
        currentVal += increment;
        if (currentVal >= target) {
          clearInterval(updateNumber);
          // Format output with '+'
          counter.textContent = target + '+';
        } else {
          counter.textContent = Math.floor(currentVal);
        }
      }, stepTime);
    });
  }

  const countersObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        animateCounters();
        countersAnimated = true;
        countersObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.25
  });

  if (achievementsSection) {
    countersObserver.observe(achievementsSection);
  }


  /* ==========================================================================
     12. INTERSECTION OBSERVER FOR SKILLS PROGRESS BARS
     ========================================================================== */
  const skillsSection = document.getElementById('skills');
  const skillFills = document.querySelectorAll('.skill-fill');

  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillFills.forEach(fill => {
          const progress = fill.getAttribute('data-progress');
          fill.style.width = progress;
        });
        skillsObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }


  /* ==========================================================================
     13. SCROLL REVEAL (FADE AND SHIFT OBSERVER)
     ========================================================================== */
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  reveals.forEach(element => {
    revealObserver.observe(element);
  });


  /* ==========================================================================
     14. ACTIVE LINK SCROLL OBSERVER
     ========================================================================== */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  function updateActiveNavLink() {
    let scrollY = window.pageYOffset;

    sections.forEach(sec => {
      const sectionHeight = sec.offsetHeight;
      const sectionTop = sec.offsetTop - 120;
      const sectionId = sec.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveNavLink);


  /* ==========================================================================
     15. BACK TO TOP BUTTON
     ========================================================================== */
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  /* ==========================================================================
     16. CANVASES PARTICLE DYNAMICS
     ========================================================================== */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 120 };

    function initCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    }
    
    window.addEventListener('resize', initCanvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor(x, y, dx, dy, size, color) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.size = size;
        this.color = color;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        if (this.x > canvas.width || this.x < 0) this.dx = -this.dx;
        if (this.y > canvas.height || this.y < 0) this.dy = -this.dy;

        // Easing repels away from cursor
        if (mouse.x && mouse.y) {
          let diffX = mouse.x - this.x;
          let diffY = mouse.y - this.y;
          let distance = Math.sqrt(diffX * diffX + diffY * diffY);
          
          if (distance < mouse.radius) {
            const push = (mouse.radius - distance) / mouse.radius;
            this.x -= (diffX / distance) * push * 4;
            this.y -= (diffY / distance) * push * 4;
          }
        }

        this.x += this.dx;
        this.y += this.dy;
        this.draw();
      }
    }

    function createParticles() {
      particles = [];
      let total = (canvas.width * canvas.height) / 18000;
      if (total > 80) total = 80;
      if (total < 20) total = 20;

      const isLight = body.classList.contains('light-theme');
      const color = isLight ? 'rgba(37, 99, 235, 0.12)' : 'rgba(6, 182, 212, 0.12)';

      for (let i = 0; i < total; i++) {
        let size = (Math.random() * 2) + 1;
        let x = Math.random() * (canvas.width - size * 2) + size;
        let y = Math.random() * (canvas.height - size * 2) + size;
        let dx = (Math.random() * 0.3) - 0.15;
        let dy = (Math.random() * 0.3) - 0.15;

        particles.push(new Particle(x, y, dx, dy, size, color));
      }
    }

    function connect() {
      const isLight = body.classList.contains('light-theme');
      const strokeColor = isLight ? 'rgba(37, 99, 235, 0.03)' : 'rgba(6, 182, 212, 0.03)';
      
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          let dist = Math.sqrt(
            Math.pow(particles[a].x - particles[b].x, 2) + 
            Math.pow(particles[a].y - particles[b].y, 2)
          );
          
          if (dist < 120) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => p.update());
      connect();
      requestAnimationFrame(tick);
    }

    themeToggleBtn.addEventListener('click', () => {
      createParticles();
    });

    initCanvas();
    tick();
  }


  /* ==========================================================================
     17. CONTACT FORM SUBMIT & VAL
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();
      const submitBtn = contactForm.querySelector('.btn-submit');
      const btnText = submitBtn.querySelector('span');

      if (!name || !email || !subject || !message) {
        displayMessage('Please write values for all fields.', 'error');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        displayMessage('Please enter a valid email address.', 'error');
        return;
      }

      submitBtn.disabled = true;
      btnText.textContent = 'Sending Message...';

      setTimeout(() => {
        displayMessage('Thank you! Your message has been sent successfully.', 'success');
        contactForm.reset();
        submitBtn.disabled = false;
        btnText.textContent = 'Send Message';
      }, 1500);
    });
  }

  function displayMessage(msg, type) {
    if (formStatus) {
      formStatus.textContent = msg;
      formStatus.className = `form-status-msg ${type}`;
      formStatus.style.display = 'block';
      
      setTimeout(() => {
        formStatus.style.display = 'none';
      }, 4500);
    }
  }

});
