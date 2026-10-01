/**
 * RSON DESIGN STUDIO — MAIN ARCHITECTURAL SCRIPT
 * Minimal, zero-dependency, agency-level precision
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. HERO SLIDER INTERACTION (MATCHING REFERENCE MOCKUP)
  const heroSlides = document.querySelectorAll('.hero-slide');
  const prevBtn = document.querySelector('.hero-nav-prev');
  const nextBtn = document.querySelector('.hero-nav-next');
  const heroCaption = document.getElementById('heroCaptionText');
  const heroProgress = document.getElementById('heroProgressActive');
  const currentNumEl = document.getElementById('heroCurrentNum');

  const slideData = [
    { title: 'Custom Pavilion Architecture — Pragati Maidan', link: 'exhibitions.html' },
    { title: 'MATECIA Grand Architectural Pavilion — Pragati Maidan', link: 'exhibitions.html' },
    { title: 'PLASTINDIA Sovereign Pavilion — Bharat Mandapam', link: 'exhibitions.html' }
  ];

  let currentSlide = 0;
  const totalSlides = heroSlides.length;

  function setSlide(index) {
    if (totalSlides === 0) return;
    currentSlide = (index + totalSlides) % totalSlides;

    heroSlides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentSlide);
    });

    if (currentNumEl) {
      currentNumEl.textContent = String(currentSlide + 1).padStart(2, '0');
    }

    if (heroCaption && slideData[currentSlide]) {
      heroCaption.textContent = slideData[currentSlide].title;
    }

    if (heroProgress) {
      const step = 100 / totalSlides;
      heroProgress.style.left = `${currentSlide * step}%`;
      heroProgress.style.width = `${step}%`;
    }
  }

  const SLIDE_INTERVAL = 3500; // Decreased auto-scroll time (3.5s) for responsive feel

  function resetTimer() {
    clearInterval(sliderTimer);
    sliderTimer = setInterval(() => {
      setSlide(currentSlide + 1);
    }, SLIDE_INTERVAL);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      setSlide(currentSlide - 1);
      resetTimer();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      setSlide(currentSlide + 1);
      resetTimer();
    });
  }

  // Auto advance every 3.5 seconds
  let sliderTimer = setInterval(() => {
    setSlide(currentSlide + 1);
  }, SLIDE_INTERVAL);

  const heroShowcase = document.querySelector('.hero-showcase');
  if (heroShowcase) {
    heroShowcase.addEventListener('mouseenter', () => clearInterval(sliderTimer));
    heroShowcase.addEventListener('mouseleave', () => resetTimer());
  }

  // 2. HEADER SCROLL STATE
  const header = document.querySelector('.site-header');
  function handleScroll() {
    if (!header) return;
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 3. 3x3 GRID BUTTON & MOBILE DRAWER TOGGLE
  const gridBtn = document.querySelector('.btn-grid-menu');
  const mobileDrawer = document.querySelector('.mobile-drawer');

  if (gridBtn && mobileDrawer) {
    gridBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('is-open');
      gridBtn.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on mobile link click
    const mobileLinks = mobileDrawer.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('is-open');
        gridBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // 4. PROJECT CATEGORY FILTERING (FEATURED WORKS & EXHIBITIONS ARCHIVE)
  const filterBtns = document.querySelectorAll('.filter-btn, .filter-pill');
  const projectCards = document.querySelectorAll('.project-card, .exhibit-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const rawCategory = card.getAttribute('data-category') || '';
        const categories = rawCategory.toLowerCase().split(/\s+/);
        const matches = filterValue === 'all' || categories.includes(filterValue.toLowerCase());

        if (matches) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // 5. INTERSECTION OBSERVER FOR EDITORIAL REVEALS
  const fadeElements = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window) {
    const appearOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, appearOptions);

    fadeElements.forEach(el => appearOnScroll.observe(el));
  } else {
    fadeElements.forEach(el => el.classList.add('is-visible'));
  }

  // 6. BRAND CARDS INTERACTIVE MOUSE MOVE TILT EFFECT
  const brandCards = document.querySelectorAll('.brand-card');
  brandCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(600px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px) scale(1.05)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
      setTimeout(() => {
        card.style.transform = '';
      }, 300);
    });
  });

  // 7. CONSTRUCTION SECTION FILTERING & LIGHTBOX MODAL
  const constFilterBtns = document.querySelectorAll('.const-filter-btn');
  const constCards = document.querySelectorAll('.const-card');
  const constModal = document.getElementById('constModal');
  const constModalImg = document.getElementById('constModalImg');
  const constModalTitle = document.getElementById('constModalTitle');
  const constModalTag = document.getElementById('constModalTag');
  const constModalClose = document.getElementById('constModalClose');

  if (constFilterBtns.length > 0) {
    constFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        constFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-const-filter');

        constCards.forEach(card => {
          const category = card.getAttribute('data-const-category') || '';
          const matches = filterValue === 'all' || category.includes(filterValue);

          if (matches) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 20);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // Open Lightbox
  const zoomBtns = document.querySelectorAll('.const-zoom-btn, .const-media-wrap');
  zoomBtns.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = trigger.closest('.const-card');
      if (!card || !constModal) return;

      const img = card.querySelector('img');
      const title = card.querySelector('.const-title');
      const kicker = card.querySelector('.const-kicker');

      if (img && constModalImg) {
        constModalImg.src = img.src;
        constModalImg.alt = img.alt;
      }
      if (title && constModalTitle) {
        constModalTitle.textContent = title.textContent;
      }
      if (kicker && constModalTag) {
        constModalTag.textContent = kicker.textContent;
      }

      constModal.classList.add('active');
      constModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  if (constModalClose && constModal) {
    const closeModal = () => {
      constModal.classList.remove('active');
      constModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    constModalClose.addEventListener('click', closeModal);
    constModal.addEventListener('click', (e) => {
      if (e.target === constModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && constModal.classList.contains('active')) {
        closeModal();
      }
    });
  }
});

