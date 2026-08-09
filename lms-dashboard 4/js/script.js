(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. MOCK DATA
     ---------------------------------------------------------- */
  const student = {
    name: 'Aditi Perera',
    firstName: 'Aditi'
  };

  const courses = [
    {
      id: 'c1',
      name: 'UX & Product Design Foundations',
      instructor: 'Naledi Osei',
      category: 'Design',
      image: 'images/faizur-rehman-pHPzdEHN6Os-unsplash.webp',
      progress: 72,
      completedActivities: 26,
      totalActivities: 36,
      description: 'Learn user research, wireframing and prototyping through real product briefs — from first sketch to a usability-tested flow.'
    },
    {
      id: 'c2',
      name: 'Full-Stack Web Development',
      instructor: 'Marco Bellandi',
      category: 'Development',
      image: 'images/tirza-van-dijk-o1SKqmgSDbg-unsplash.webp',
      progress: 45,
      completedActivities: 18,
      totalActivities: 40,
      description: 'Build and ship a complete web application: front-end interfaces, REST APIs, databases, and deployment basics.'
    },
    {
      id: 'c3',
      name: 'Data Analytics Fundamentals',
      instructor: 'Priya Raghunathan',
      category: 'Data',
      image: 'images/tran-mau-tri-tam-g-pKprPg5yw-unsplash.webp',
      progress: 100,
      completedActivities: 30,
      totalActivities: 30,
      description: 'Work with spreadsheets, SQL and visualization tools to turn raw data into decisions stakeholders can act on.'
    },
    {
      id: 'c4',
      name: 'Digital Marketing Essentials',
      instructor: 'Owen Faulkner',
      category: 'Marketing',
      image: 'images/ux-indonesia-qC2n6RQU4Vw-unsplash (2).webp',
      progress: 18,
      completedActivities: 4,
      totalActivities: 22,
      description: 'Plan and run campaigns across search, social and email while learning to read the metrics that matter.'
    },
    {
      id: 'c5',
      name: 'Intro to UI Animation',
      instructor: 'Naledi Osei',
      category: 'Design',
      image: 'images/alvaro-reyes-KxVlKiqQObU-unsplash (1).webp',
      progress: 60,
      completedActivities: 9,
      totalActivities: 15,
      description: 'Bring interfaces to life with purposeful motion — easing, timing, and micro-interactions that guide attention.'
    },
    {
      id: 'c6',
      name: 'Backend APIs with Node.js',
      instructor: 'Marco Bellandi',
      category: 'Development',
      image: 'images/eftakher-alam-i1VQZsU86ok-unsplash.webp',
      progress: 5,
      completedActivities: 1,
      totalActivities: 24,
      description: 'Design REST APIs, handle authentication, and connect to a database using Node.js and Express.'
    }
  ];

  const state = {
    search: '',
    category: 'all',
    sort: 'default'
  };

  /* ----------------------------------------------------------
     2. WELCOME SECTION (Section 01)
     ---------------------------------------------------------- */
  function renderWelcome() {
    document.getElementById('studentFirstName').textContent = student.firstName;
    document.getElementById('headerStudentName').textContent = student.name;

    const hour = new Date().getHours();
    const greetingWindow = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    document.getElementById('welcomeMessage').textContent =
      `Good ${greetingWindow}! You're making solid progress this week — pick up right where you left off.`;

    const today = new Date();
    document.getElementById('welcomeDate').textContent = today.toLocaleDateString(undefined, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  function renderSummary() {
    const enrolled = courses.length;
    const completed = courses.filter(c => c.progress >= 100).length;
    const overall = Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length);

    document.getElementById('statEnrolled').textContent = enrolled;
    document.getElementById('statCompleted').textContent = completed;
    document.getElementById('statOverall').textContent = overall + '%';

    const circumference = 169.6; // 2 * PI * r(27)
    const ring = document.getElementById('overallRing');
    const offset = circumference - (overall / 100) * circumference;
    requestAnimationFrame(() => { ring.style.strokeDashoffset = offset; });
  }

  /* ----------------------------------------------------------
     3. COURSE CARDS (Section 02)
     ---------------------------------------------------------- */
  const grid = document.getElementById('cardContainer');
  const emptyState = document.getElementById('emptyState');
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const sortSelect = document.getElementById('sortSelect');

  function renderCategoryOptions() {
    const categories = Array.from(new Set(courses.map(c => c.category))).sort();
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      categoryFilter.appendChild(opt);
    });
  }

  function courseCardHTML(course) {
    return `
      <article class="lms-card" data-id="${course.id}">
        <div class="lms-card-media">
          <span class="lms-card-category">${course.category}</span>
          <img src="${course.image}" alt="${course.name} cover" loading="lazy">
        </div>
        <div class="lms-card-body">
          <h3 class="lms-card-title">${course.name}</h3>
          <p class="lms-card-instructor">Instructor: ${course.instructor}</p>

          <div class="lms-card-progress-row">
            <span>Progress</span>
            <span>${course.progress}%</span>
          </div>
          <div class="lms-progress-track" role="progressbar" aria-valuenow="${course.progress}" aria-valuemin="0" aria-valuemax="100" aria-label="${course.name} progress">
            <div class="lms-progress-fill" data-target="${course.progress}" style="width:0%"></div>
          </div>
          <p class="lms-card-activities">${course.completedActivities} of ${course.totalActivities} activities completed</p>

          <button type="button" class="lms-btn-primary" data-open-modal="${course.id}">
            ${course.progress >= 100 ? 'Review Course' : 'Continue Course'}
          </button>
        </div>
      </article>
    `;
  }

  function getVisibleCourses() {
    let list = courses.filter(c => {
      const matchesSearch =
        c.name.toLowerCase().includes(state.search) ||
        c.instructor.toLowerCase().includes(state.search);
      const matchesCategory = state.category === 'all' || c.category === state.category;
      return matchesSearch && matchesCategory;
    });

    if (state.sort === 'progress-desc') list = list.slice().sort((a, b) => b.progress - a.progress);
    else if (state.sort === 'progress-asc') list = list.slice().sort((a, b) => a.progress - b.progress);
    else if (state.sort === 'name-asc') list = list.slice().sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }

  function renderCourses() {
    const visible = getVisibleCourses();

    if (visible.length === 0) {
      grid.innerHTML = '';
      emptyState.classList.remove('lms-hidden');
      if (window.courseSlider) window.courseSlider.refresh();
      return;
    }
    emptyState.classList.add('lms-hidden');

    grid.innerHTML = visible.map(courseCardHTML).join('');

    requestAnimationFrame(() => {
      grid.querySelectorAll('.lms-progress-fill').forEach(bar => {
        const target = bar.getAttribute('data-target');
        requestAnimationFrame(() => { bar.style.width = target + '%'; });
      });
    });

    grid.querySelectorAll('[data-open-modal]').forEach(btn => {
      btn.addEventListener('click', () => openModal(btn.getAttribute('data-open-modal')));
    });

    // Slider needs to recompute card count / dots whenever the DOM changes
    if (window.courseSlider) window.courseSlider.refresh();
  }

  searchInput.addEventListener('input', (e) => {
    state.search = e.target.value.trim().toLowerCase();
    renderCourses();
  });
  categoryFilter.addEventListener('change', (e) => {
    state.category = e.target.value;
    renderCourses();
  });
  sortSelect.addEventListener('change', (e) => {
    state.sort = e.target.value;
    renderCourses();
  });

  /* ----------------------------------------------------------
     4. COURSE SLIDER
     ---------------------------------------------------------- */
  class CourseSlider {
    constructor() {
      this.container = document.getElementById('cardContainer');
      this.prevBtn = document.getElementById('prevBtn');
      this.nextBtn = document.getElementById('nextBtn');
      this.dotsContainer = document.getElementById('sliderDots');

      this.currentIndex = 0;
      this.startX = 0;
      this.currentX = 0;
      this.isDragging = false;
      this.dragThreshold = 50;

      this.init();
    }

    init() {
      this.updateCardsPerView();
      this.createDots();
      this.bindEvents();
      window.addEventListener('resize', () => {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
          this.updateCardsPerView();
          this.createDots();
        }, 100);
      });
    }

    // Recompute after the card list changes
    refresh() {
      this.currentIndex = 0;
      this.updateCardsPerView();
      this.createDots();
    }

    get cards() {
      return this.container.querySelectorAll('.lms-card');
    }

    updateCardsPerView() {
      const width = window.innerWidth;
      if (width < 768) this.cardsPerView = 1;
      else if (width < 1200) this.cardsPerView = 2;
      else this.cardsPerView = 4;

      const totalCards = this.cards.length;
      this.maxIndex = Math.max(0, totalCards - this.cardsPerView);
      this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
      this.updateSlider();
    }

    createDots() {
      this.dotsContainer.innerHTML = '';
      const dotsCount = this.maxIndex + 1;
      for (let i = 0; i < dotsCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'lms-dot';
        dot.addEventListener('click', () => this.goToSlide(i));
        this.dotsContainer.appendChild(dot);
      }
      this.updateDots();
    }

    updateDots() {
      const dots = this.dotsContainer.querySelectorAll('.lms-dot');
      dots.forEach((dot, index) => dot.classList.toggle('is-active', index === this.currentIndex));
      this.dotsContainer.style.display = dots.length <= 1 ? 'none' : 'flex';
    }

    getGapSize() {
      const width = window.innerWidth;
      if (width < 768) return 0;
      if (width < 992) return 12;
      if (width < 1200) return 16;
      if (width < 1300) return 20;
      if (width < 1400) return 22;
      return 24;
    }

    updateSlider() {
      const cards = this.cards;
      if (!cards.length) {
        this.prevBtn.disabled = true;
        this.nextBtn.disabled = true;
        return;
      }
      const cardWidth = cards[0].offsetWidth;
      const gap = this.getGapSize();
      const translateX = -(this.currentIndex * (cardWidth + gap));

      this.container.style.transform = `translateX(${translateX}px)`;
      this.updateDots();

      this.prevBtn.disabled = this.currentIndex <= 0;
      this.nextBtn.disabled = this.currentIndex >= this.maxIndex;
    }

    nextSlide() {
      if (this.currentIndex < this.maxIndex) {
        this.currentIndex++;
        this.updateSlider();
      }
    }

    prevSlide() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.updateSlider();
      }
    }

    goToSlide(index) {
      this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
      this.updateSlider();
    }

    bindEvents() {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
      this.prevBtn.addEventListener('click', () => this.prevSlide());

      this.container.addEventListener('touchstart', (e) => this.handleStart(e.touches[0].clientX), { passive: true });
      this.container.addEventListener('touchmove', (e) => this.handleMove(e.touches[0].clientX, e), { passive: false });
      this.container.addEventListener('touchend', () => this.handleEnd(), { passive: true });

      this.container.addEventListener('mousedown', (e) => { this.handleStart(e.clientX); e.preventDefault(); });
      this.container.addEventListener('mousemove', (e) => this.handleMove(e.clientX, e));
      this.container.addEventListener('mouseup', () => this.handleEnd());
      this.container.addEventListener('mouseleave', () => { if (this.isDragging) this.handleEnd(); });

      this.container.addEventListener('dragstart', (e) => e.preventDefault());
    }

    handleStart(clientX) {
      this.startX = clientX;
      this.isDragging = true;
      this.container.style.transition = 'none';
    }

    handleMove(clientX, e) {
      if (!this.isDragging) return;
      if (e.cancelable) e.preventDefault();
      this.currentX = clientX;
      const diff = this.currentX - this.startX;

      const cards = this.cards;
      if (!cards.length) return;
      const cardWidth = cards[0].offsetWidth;
      const gap = this.getGapSize();
      const currentTransform = -(this.currentIndex * (cardWidth + gap));
      this.container.style.transform = `translateX(${currentTransform + diff * 0.3}px)`;
    }

    handleEnd() {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.container.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

      const diff = this.currentX - this.startX;
      if (Math.abs(diff) > this.dragThreshold) {
        diff > 0 ? this.prevSlide() : this.nextSlide();
      } else {
        this.updateSlider();
      }
      this.currentX = 0;
    }
  }

  /* ----------------------------------------------------------
     5. COURSE DETAILS MODAL
     ---------------------------------------------------------- */
  const modal = document.getElementById('courseModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalClose = document.getElementById('modalClose');
  let lastFocusedEl = null;

  function openModal(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    document.getElementById('modalImage').src = course.image;
    document.getElementById('modalImage').alt = course.name + ' cover';
    document.getElementById('modalCategory').textContent = course.category;
    document.getElementById('modalTitle').textContent = course.name;
    document.getElementById('modalInstructor').textContent = 'Instructor: ' + course.instructor;
    document.getElementById('modalProgressLabel').textContent = course.progress + '%';
    document.getElementById('modalActivities').textContent =
      `${course.completedActivities} of ${course.totalActivities} activities completed`;
    document.getElementById('modalDescription').textContent = course.description;
    document.getElementById('modalContinueBtn').textContent = course.progress >= 100 ? 'Review Course' : 'Continue Course';

    const bar = document.getElementById('modalProgressBar');
    bar.style.width = '0%';

    lastFocusedEl = document.activeElement;
    modal.classList.remove('lms-hidden');
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => { bar.style.width = course.progress + '%'; });
    modalClose.focus();
  }

  function closeModal() {
    modal.classList.add('lms-hidden');
    document.body.style.overflow = '';
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('lms-hidden')) closeModal();
  });

  /* ----------------------------------------------------------
     6. HEADER — toggle menu
     ---------------------------------------------------------- */
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const lmsNav = document.getElementById('lmsNav');
  const iconBurger = document.querySelector('#menuToggleBtn .lms-icon-burger');
  const iconClose = document.querySelector('#menuToggleBtn .lms-icon-close');

  function setMenuOpen(isOpen) {
    lmsNav.classList.toggle('lms-header-div2--open', isOpen);
    menuToggleBtn.setAttribute('aria-expanded', String(isOpen));
    iconBurger.classList.toggle('lms-hidden', isOpen);
    iconClose.classList.toggle('lms-hidden', !isOpen);
  }

  menuToggleBtn.addEventListener('click', () => {
    setMenuOpen(!lmsNav.classList.contains('lms-header-div2--open'));
  });

  const navLinks = document.querySelectorAll('.lms-header-div2-link[data-nav]');

  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', () => {
      setMenuOpen(false);

      // "Click hover" — the clicked nav link keeps a highlighted state
      // instead of reverting once the mouse/finger leaves it.
      if (link.classList.contains('lms-header-div2-link')) {
        navLinks.forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1200) setMenuOpen(false);
  });

  /* ----------------------------------------------------------
     7. DARK MODE
     ---------------------------------------------------------- */
  const root = document.documentElement;
  const darkButtons = [
    document.getElementById('darkModeToggleDesktop'),
    document.getElementById('darkModeToggleMobile')
  ];

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    root.classList.toggle('dark', isDark);
    darkButtons.forEach(btn => {
      btn.setAttribute('aria-pressed', String(isDark));
      btn.querySelector('.lms-icon-sun').classList.toggle('lms-hidden', isDark);
      btn.querySelector('.lms-icon-moon').classList.toggle('lms-hidden', !isDark);
    });
  }

  function getPreferredTheme() {
    const saved = localStorage.getItem('coursemark-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  applyTheme(getPreferredTheme());

  darkButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const next = root.classList.contains('dark') ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('coursemark-theme', next);
    });
  });

  /* ----------------------------------------------------------
     8. SCROLL-REVEAL for the two main sections
     ---------------------------------------------------------- */
  function initScrollReveal() {
    const targets = document.querySelectorAll('#section01, #section02');
    targets.forEach(el => el.classList.add('lms-reveal'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => observer.observe(el));
  }

  /* ----------------------------------------------------------
     9. INIT
     ---------------------------------------------------------- */
  document.getElementById('footerYear').textContent = new Date().getFullYear();
  renderWelcome();
  renderSummary();
  renderCategoryOptions();
  renderCourses();
  initScrollReveal();

  // Script tag sits at the end of <body>, so the DOM is already parsed here.
  window.courseSlider = new CourseSlider();

})();
