/**
 * SYNAPSE 2026 - Global Tech & Leadership Summit
 * Client Logic & Interactions
 * Vanilla ES6+ - Fast, High Performance, Zero Dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initHeroCanvas();
  initCountdownTimer();
  initNavbar();
  initAnimatedStats();
  initTestimonialCarousel();
  initFaqAccordion();
  initCursorGlow();
  initBackToTop();
  updateModalPricing();
});

/* ==========================================================================
   1. HERO CANVAS PARTICLE CONSTELLATION
   GPU-friendly, 60fps, low CPU overhead with viewport intersection pausing
   ========================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let animationFrameId;
  let isCanvasVisible = true;

  const mouse = {
    x: null,
    y: null,
    radius: 120
  };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = (Math.random() * 20) + 1;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.color = Math.random() > 0.4 ? 'rgba(56, 189, 248, ' : 'rgba(99, 102, 241, ';
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }

    update() {
      // Natural drifting
      this.x += this.vx;
      this.y += this.vy;

      // Bounce boundaries
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactive reaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = (dx / distance) * force * this.density * 0.4;
          const directionY = (dy / distance) * force * this.density * 0.4;
          this.x -= directionX;
          this.y -= directionY;
        }
      }
    }
  }

  // Generate particles based on screen width (max ~55 for performance)
  const count = Math.min(Math.floor(width / 26), 55);
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  // Draw connecting constellation lines
  function connectParticles() {
    const maxDist = 110;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.22;
          ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    if (!isCanvasVisible) return;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].draw();
      particles[i].update();
    }
    connectParticles();

    animationFrameId = requestAnimationFrame(animate);
  }

  // IntersectionObserver to pause canvas animation when out of view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isCanvasVisible = true;
        animate();
      } else {
        isCanvasVisible = false;
        cancelAnimationFrame(animationFrameId);
      }
    });
  }, { threshold: 0.05 });

  observer.observe(canvas);
}

/* ==========================================================================
   2. LIVE COUNTDOWN TIMER
   Calculates exact remaining time to October 14, 2026 09:00 PDT
   ========================================================================== */
function initCountdownTimer() {
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMins = document.getElementById('cdMins');
  const cdSecs = document.getElementById('cdSecs');

  if (!cdDays || !cdHours || !cdMins || !cdSecs) return;

  // Event Date: October 14, 2026, 09:00:00 PDT
  const targetDate = new Date('2026-10-14T09:00:00-07:00').getTime();

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMins.textContent = '00';
      cdSecs.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    cdDays.textContent = String(days).padStart(2, '0');
    cdHours.textContent = String(hours).padStart(2, '0');
    cdMins.textContent = String(minutes).padStart(2, '0');
    cdSecs.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   3. NAVBAR INTERACTIONS & SCROLL SPY
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('mainHeader');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll glass blur effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile Menu Toggle
  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      toggleMobileMenu();
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });
  }

  // Active Link Spy using IntersectionObserver
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.25, rootMargin: '-80px 0px -40% 0px' });

  sections.forEach(sec => sectionObserver.observe(sec));
}

function toggleMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburgerBtn || !mobileMenu) return;

  const isOpen = mobileMenu.classList.contains('open');
  if (isOpen) {
    closeMobileMenu();
  } else {
    mobileMenu.classList.add('open');
    hamburgerBtn.classList.add('open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

function closeMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!mobileMenu) return;

  mobileMenu.classList.remove('open');
  if (hamburgerBtn) {
    hamburgerBtn.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ==========================================================================
   4. ANIMATED STATS COUNTER
   Counts up dynamically when scrolled into view
   ========================================================================== */
function initAnimatedStats() {
  const statsSection = document.getElementById('statsGrid');
  if (!statsSection) return;

  let animated = false;
  const numbers = statsSection.querySelectorAll('.stat-number');

  function animateCounters() {
    numbers.forEach(num => {
      const target = parseInt(num.getAttribute('data-target'), 10);
      const duration = 1800; // ms
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic calculation
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeProgress * target);

        num.textContent = currentVal.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          num.textContent = target.toLocaleString();
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);
}

/* ==========================================================================
   5. SCHEDULE DAY SWITCHER
   ========================================================================== */
function switchScheduleDay(dayNumber) {
  const tabs = document.querySelectorAll('.schedule-tabs .tab-btn');
  const panels = document.querySelectorAll('.timeline-panel');

  tabs.forEach((tab, index) => {
    const isCurrent = (index + 1) === dayNumber;
    tab.classList.toggle('active', isCurrent);
    tab.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
  });

  panels.forEach((panel, index) => {
    const isCurrent = (index + 1) === dayNumber;
    panel.classList.toggle('active', isCurrent);
  });
}
window.switchScheduleDay = switchScheduleDay;

/* ==========================================================================
   6. TESTIMONIAL CAROUSEL
   Auto-advances, pause on hover, interactive prev/next/dots
   ========================================================================== */
function initTestimonialCarousel() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.carousel-dots .dot-btn');
  const prevBtn = document.getElementById('prevTestimonialBtn');
  const nextBtn = document.getElementById('nextTestimonialBtn');
  const carouselContainer = document.getElementById('testimonialCarousel');

  if (!slides.length) return;

  let currentIndex = 0;
  let autoplayTimer;

  function showSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
      dot.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
    });
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      resetTimer();
    });
  });

  function startTimer() {
    autoplayTimer = setInterval(nextSlide, 7000);
  }

  function resetTimer() {
    clearInterval(autoplayTimer);
    startTimer();
  }

  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    carouselContainer.addEventListener('mouseleave', () => startTimer());
  }

  startTimer();
}

/* ==========================================================================
   7. FAQ ACCORDION
   Accessible, smooth height animation
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const answer = item.querySelector('.faq-answer');

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other opened items for clean accordion behavior
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   8. REGISTRATION MODAL & PRICING ENGINE
   ========================================================================== */
let currentTicketQty = 1;
let currentDiscount = 0; // percentage e.g. 0.20

const TIER_PRICES = {
  Basic: 499,
  Professional: 999,
  VIP: 1999
};

function getSelectedTier() {
  const selected = document.querySelector('input[name="ticketTier"]:checked');
  return selected ? selected.value : 'Professional';
}

function openRegistrationModal(preSelectedTier = 'Professional') {
  const modal = document.getElementById('registrationModal');
  if (!modal) return;

  // Pre-select chosen tier radio button
  const radio = document.querySelector(`input[name="ticketTier"][value="${preSelectedTier}"]`);
  if (radio) {
    radio.checked = true;
  }

  // Reset form to active input state
  document.getElementById('modalFormBody').style.display = 'block';
  document.getElementById('modalSuccessBody').style.display = 'none';

  updateModalPricing();

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
window.openRegistrationModal = openRegistrationModal;

function closeRegistrationModal() {
  const modal = document.getElementById('registrationModal');
  if (!modal) return;

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
window.closeRegistrationModal = closeRegistrationModal;

// Stepper for Ticket Quantity
function stepTicketQty(delta) {
  const newQty = currentTicketQty + delta;
  if (newQty >= 1 && newQty <= 20) {
    currentTicketQty = newQty;
    document.getElementById('ticketQtyDisplay').textContent = currentTicketQty;
    updateModalPricing();
  }
}
window.stepTicketQty = stepTicketQty;

// Promo Code Verification
function applyPromoCode() {
  const input = document.getElementById('promoCodeInput');
  const msg = document.getElementById('promoMsg');
  const code = (input.value || '').trim().toUpperCase();

  if (code === 'SYNAPSE20' || code === 'VIP2026' || code === 'FOUNDER') {
    currentDiscount = 0.20; // 20% discount
    msg.textContent = '✓ 20% Founder Discount Applied Successfully!';
    msg.className = 'promo-status-msg success';
    showToast('20% Summit Promo Code Activated!', 'success');
  } else if (code === '') {
    currentDiscount = 0;
    msg.textContent = '';
  } else {
    currentDiscount = 0;
    msg.textContent = '✕ Invalid promo code. Try SYNAPSE20';
    msg.className = 'promo-status-msg error';
  }

  updateModalPricing();
}
window.applyPromoCode = applyPromoCode;

// Live Price Recalculation
function updateModalPricing() {
  const tier = getSelectedTier();
  const unitPrice = TIER_PRICES[tier] || 999;
  const subtotal = unitPrice * currentTicketQty;
  const discountAmount = subtotal * currentDiscount;
  const total = subtotal - discountAmount;

  const summaryTierTitle = document.getElementById('summaryTierTitle');
  const summaryTierSubtotal = document.getElementById('summaryTierSubtotal');
  const discountRow = document.getElementById('discountSummaryRow');
  const summaryDiscount = document.getElementById('summaryDiscount');
  const summaryTotalAmount = document.getElementById('summaryTotalAmount');

  if (summaryTierTitle) summaryTierTitle.textContent = `${tier} Pass (${currentTicketQty}x)`;
  if (summaryTierSubtotal) summaryTierSubtotal.textContent = `$${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  if (discountRow) {
    if (currentDiscount > 0) {
      discountRow.style.display = 'flex';
      summaryDiscount.textContent = `-$${discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    } else {
      discountRow.style.display = 'none';
    }
  }

  if (summaryTotalAmount) {
    summaryTotalAmount.textContent = `$${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }
}
window.updateModalPricing = updateModalPricing;

// Handle Registration Submission
function handleRegistrationSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById('regFullName');
  const emailInput = document.getElementById('regEmail');
  const phoneInput = document.getElementById('regPhone');
  const companyInput = document.getElementById('regCompany');

  let isValid = true;

  // Validation checks
  if (!nameInput.value.trim()) {
    showInputError('nameError', true);
    isValid = false;
  } else {
    showInputError('nameError', false);
  }

  if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
    showInputError('emailError', true);
    isValid = false;
  } else {
    showInputError('emailError', false);
  }

  if (!phoneInput.value.trim()) {
    showInputError('phoneError', true);
    isValid = false;
  } else {
    showInputError('phoneError', false);
  }

  if (!companyInput.value.trim()) {
    showInputError('companyError', true);
    isValid = false;
  } else {
    showInputError('companyError', false);
  }

  if (!isValid) return;

  // Submit Animation / Pass Generation
  const selectedTier = getSelectedTier();
  const delegateName = nameInput.value.trim();
  const delegateCompany = companyInput.value.trim();
  const passQty = currentTicketQty;

  // Generate unique pass token
  const randomHash = 'SYN-2026-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.floor(10 + Math.random() * 90);

  // Populate Digital Ticket Card
  document.getElementById('issuedTierBadge').textContent = `${selectedTier.toUpperCase()} PASS`;
  document.getElementById('issuedName').textContent = delegateName;
  document.getElementById('issuedOrg').textContent = delegateCompany;
  document.getElementById('issuedQty').textContent = `${passQty} Access Pass${passQty > 1 ? 'es' : ''}`;
  document.getElementById('issuedHash').textContent = randomHash;

  // Switch to digital ticket view
  document.getElementById('modalFormBody').style.display = 'none';
  document.getElementById('modalSuccessBody').style.display = 'block';

  showToast(`Delegate Pass Issued for ${delegateName}!`, 'success');
}
window.handleRegistrationSubmit = handleRegistrationSubmit;

function showInputError(elementId, show) {
  const el = document.getElementById(elementId);
  if (el) el.classList.toggle('visible', show);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function printPass() {
  window.print();
}
window.printPass = printPass;

function resetAndCloseModal() {
  document.getElementById('registrationForm').reset();
  currentTicketQty = 1;
  currentDiscount = 0;
  document.getElementById('ticketQtyDisplay').textContent = '1';
  document.getElementById('promoMsg').textContent = '';
  closeRegistrationModal();
}
window.resetAndCloseModal = resetAndCloseModal;

/* ==========================================================================
   9. SPONSOR MODAL
   ========================================================================== */
function openSponsorModal() {
  const modal = document.getElementById('sponsorModal');
  if (modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}
window.openSponsorModal = openSponsorModal;

function closeSponsorModal() {
  const modal = document.getElementById('sponsorModal');
  if (modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}
window.closeSponsorModal = closeSponsorModal;

function handleSponsorSubmit(e) {
  e.preventDefault();
  closeSponsorModal();
  showToast('Partnership proposal received. An executive director will follow up within 24h.', 'success');
  e.target.reset();
}
window.handleSponsorSubmit = handleSponsorSubmit;

/* ==========================================================================
   10. NEWSLETTER DISPATCH FORM
   ========================================================================== */
function handleNewsletterSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('newsletterEmail');
  if (input && input.value) {
    showToast(`Subscribed! Confidential dispatch sent to ${input.value}`, 'success');
    input.value = '';
  }
}
window.handleNewsletterSubmit = handleNewsletterSubmit;

/* ==========================================================================
   11. TOAST NOTIFICATION ENGINE
   ========================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon">✦</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger smooth enter animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 400);
  }, 4200);
}

/* ==========================================================================
   12. AMBIENT CURSOR GLOW (DESKTOP)
   ========================================================================== */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.innerWidth < 992) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function render() {
    // Smooth trailing interpolation
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;

    glow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   13. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
window.scrollToTop = scrollToTop;

// Close modals on ESC key or backdrop click
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeRegistrationModal();
    closeSponsorModal();
    closeMobileMenu();
  }
});

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-backdrop')) {
    closeRegistrationModal();
    closeSponsorModal();
  }
});
