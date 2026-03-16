/**
 * script.js — Anurag Luckshetty
 *
 * Sections:
 *   1. EmailJS setup (⚠️ configure before deploying)
 *   2. Theme toggle
 *   3. Navigation — scroll shadow + active link
 *   4. Hamburger / mobile menu
 *   5. Typing animation
 *   6. Scroll reveal (IntersectionObserver)
 *   7. Skill bar animation
 *   8. Mouse parallax on hero
 *   9. Back-to-top button
 *  10. Contact form — validation + EmailJS send
 */

/* ==============================================================
   1. EMAILJS SETUP
   ==============================================================
   Before this form will actually send emails you need to:

   Step 1 — Create a free account at https://www.emailjs.com
   Step 2 — Go to "Email Services" and connect your Gmail account
   Step 3 — Go to "Email Templates" and create a new template.
             Map these template variables to your content fields:
               {{from_name}}    → sender's name
               {{from_email}}   → sender's email
               {{subject}}      → message subject
               {{message}}      → message body
             Set the "To Email" in the template to:
               anuragluckshetty08@gmail.com
   Step 4 — Copy your Service ID, Template ID, and Public Key
             and replace the three placeholder values below.
   Step 5 — Save and deploy. Messages will now arrive at Gmail.
   ============================================================== */

const EMAILJS_SERVICE_ID  = 'service_anurag';   // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'template_fauf5mu';  // e.g. 'template_xyz456'
const EMAILJS_PUBLIC_KEY  = 'JmbaVOWbNEInLyv4w';   // e.g. 'aBcDeFgHiJkLmNoP'

// initialise once the SDK is loaded
(function initEmailJS() {
  if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'PUBLIC_KEY_HERE') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }
})();


/* ==============================================================
   2. THEME TOGGLE
   ============================================================== */
const themeToggleBtn = document.getElementById('themeToggle');
const themeIconEl    = document.getElementById('themeIcon');
const htmlEl         = document.documentElement;

// remember preference across page loads
let isDark = localStorage.getItem('theme') !== 'light';
applyTheme(isDark);

themeToggleBtn.addEventListener('click', () => {
  isDark = !isDark;
  applyTheme(isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

function applyTheme(dark) {
  htmlEl.setAttribute('data-theme', dark ? 'dark' : 'light');
  themeIconEl.className = dark ? 'fas fa-moon' : 'fas fa-sun';
}


/* ==============================================================
   3. NAVIGATION — scroll shadow + active section highlight
   ============================================================== */
const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  // add a subtle shadow once user scrolls past the hero fold
  navbar.classList.toggle('scrolled', window.scrollY > 20);

  // highlight whichever nav link matches the current section
  let currentSectionId = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 110) {
      currentSectionId = section.id;
    }
  });

  navLinks.forEach(link => {
    const matches = link.getAttribute('href') === '#' + currentSectionId;
    link.classList.toggle('active', matches);
  });
}, { passive: true });


/* ==============================================================
   4. HAMBURGER / MOBILE MENU
   ============================================================== */
const hamburgerBtn = document.getElementById('hamburger');
const mobileMenu   = document.getElementById('mobileMenu');

hamburgerBtn.addEventListener('click', toggleMobileMenu);

// close when a link is tapped
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

function toggleMobileMenu() {
  const isOpen = hamburgerBtn.classList.toggle('open');
  mobileMenu.classList.toggle('open', isOpen);
  hamburgerBtn.setAttribute('aria-expanded', isOpen);
  mobileMenu.setAttribute('aria-hidden', !isOpen);
  // prevent body scroll while menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMobileMenu() {
  hamburgerBtn.classList.remove('open');
  mobileMenu.classList.remove('open');
  hamburgerBtn.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}


/* ==============================================================
   5. TYPING ANIMATION
   ============================================================== */
const typingEl = document.getElementById('typingText');
const roles = [
  'Java Developer',
  'ML Enthusiast',
  'Software Developer',
  'Problem Solver',
];

let roleIndex  = 0;
let charIndex  = 0;
let isTyping   = true;

function typeLoop() {
  const currentWord = roles[roleIndex];

  if (isTyping) {
    typingEl.textContent = currentWord.slice(0, ++charIndex);
    if (charIndex === currentWord.length) {
      isTyping = false;
      setTimeout(typeLoop, 1800); // pause at end of word
      return;
    }
  } else {
    typingEl.textContent = currentWord.slice(0, --charIndex);
    if (charIndex === 0) {
      isTyping = true;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(typeLoop, isTyping ? 95 : 50);
}

typeLoop();


/* ==============================================================
   6. SCROLL REVEAL (IntersectionObserver)
   ============================================================== */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // unobserve after first reveal — no need to keep watching
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ==============================================================
   7. SKILL BAR ANIMATION
   ============================================================== */
const skillBarObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
        skillBarObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.25 }
);

document.querySelectorAll('.skill-card').forEach(card => skillBarObserver.observe(card));


/* ==============================================================
   8. MOUSE PARALLAX — subtle depth effect in the hero section
   ============================================================== */
const heroSection  = document.getElementById('hero');
const heroOrbs     = document.querySelectorAll('.orb');
const heroRing     = document.querySelector('.hero-img-ring');
const floatCards   = document.querySelectorAll('.hero-float-card');

// only run parallax on desktop, skip on touch devices
const hasHover = window.matchMedia('(hover: hover)').matches;

if (hasHover) {
  document.addEventListener('mousemove', handleParallax, { passive: true });
}

function handleParallax(e) {
  // normalise mouse position to -1..1 range
  const cx = (e.clientX / window.innerWidth  - 0.5) * 2;
  const cy = (e.clientY / window.innerHeight - 0.5) * 2;

  heroOrbs.forEach((orb, i) => {
    const depth = (i + 1) * 8;
    orb.style.transform = `translate(${cx * depth}px, ${cy * depth}px) scale(1)`;
  });

  if (heroRing) {
    heroRing.style.transform = `translate(${cx * 6}px, ${cy * 6}px)`;
  }

  floatCards.forEach((card, i) => {
    const d = (i + 1) * 4;
    card.style.transform = `translate(${cx * d}px, ${cy * d}px)`;
  });
}

// reset on mouse leave
document.addEventListener('mouseleave', () => {
  heroOrbs.forEach(orb => { orb.style.transform = ''; });
  if (heroRing) heroRing.style.transform = '';
  floatCards.forEach(card => { card.style.transform = ''; });
}, { passive: true });


/* ==============================================================
   9. BACK TO TOP BUTTON
   ============================================================== */
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTopBtn.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ==============================================================
  10. CONTACT FORM — validation + EmailJS
   ============================================================== */
const contactForm = document.getElementById('contactForm');
const sendBtn     = document.getElementById('sendBtn');
const formStatus  = document.getElementById('formStatus');

// simple anti-spam: track last submission time
let lastSubmitTime = 0;
const SUBMIT_COOLDOWN_MS = 30_000; // 30 seconds between sends

contactForm.addEventListener('submit', async function handleFormSubmit(e) {
  e.preventDefault();

  // clear previous state
  clearFieldErrors();
  hideStatus();

  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const subject = document.getElementById('fsubject').value.trim();
  const message = document.getElementById('fmessage').value.trim();

  // --- validation ---
  let hasError = false;

  if (!name) {
    markFieldError('fname', 'Name is required');
    hasError = true;
  }

  if (!email) {
    markFieldError('femail', 'Email is required');
    hasError = true;
  } else if (!isValidEmail(email)) {
    markFieldError('femail', 'Please enter a valid email');
    hasError = true;
  }

  if (!message) {
    markFieldError('fmessage', 'Message is required');
    hasError = true;
  }

  if (hasError) {
    showStatus('error', '⚠️ Please fix the errors above and try again.');
    return;
  }

  // --- anti-spam cooldown ---
  const now = Date.now();
  if (now - lastSubmitTime < SUBMIT_COOLDOWN_MS) {
    const remaining = Math.ceil((SUBMIT_COOLDOWN_MS - (now - lastSubmitTime)) / 1000);
    showStatus('error', `⏳ Please wait ${remaining}s before sending another message.`);
    return;
  }

  // --- check if EmailJS is configured, use fallback if not ---
  if (EMAILJS_PUBLIC_KEY === 'PUBLIC_KEY_HERE' || EMAILJS_SERVICE_ID === 'service_YOUR_SERVICE_ID') {
    // EmailJS not configured, use direct email fallback
    const sub  = encodeURIComponent(subject || `Message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const fallbackLink = `mailto:anuragluckshetty08@gmail.com?subject=${sub}&body=${body}`;
    showStatus('info', 'Opening email client...');
    setTimeout(() => {
      window.location.href = fallbackLink;
      resetButton();
    }, 500);
    return;
  }

  // --- loading state ---
  setButtonLoading(true);
  showStatus('loading', '<span class="spinner"></span> Sending your message...');

  try {
    // EmailJS will populate the template variables with these params.
    // Make sure your template uses: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name:  name,
      from_email: email,
      subject:    subject || `Message from ${name}`,
      message:    message,
      reply_to:   email,
    });

    lastSubmitTime = Date.now();
    showStatus('success', '✅ Message sent! I\'ll get back to you soon.');
    sendBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
    contactForm.reset();

    // reset button after a few seconds
    setTimeout(resetButton, 5000);

  } catch (err) {
    console.error('EmailJS send failed:', err);

    // build a mailto: fallback so the user isn't stuck
    const sub  = encodeURIComponent(subject || `Message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const fallbackLink = `mailto:anuragluckshetty08@gmail.com?subject=${sub}&body=${body}`;

    showStatus(
      'error',
      `Send failed. <a href="${fallbackLink}" style="color:var(--accent);text-decoration:underline;">Click here to email directly.</a>`
    );
    resetButton();
  }
});

// ---- helpers ----

function isValidEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

function markFieldError(fieldId, msg) {
  const el = document.getElementById(fieldId);
  if (el) el.classList.add('field-error');
}

function clearFieldErrors() {
  contactForm.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));
}

function showStatus(type, html) {
  formStatus.className = `form-status ${type}`;
  formStatus.innerHTML = html;
}

function hideStatus() {
  formStatus.className = 'form-status';
  formStatus.innerHTML = '';
}

function setButtonLoading(loading) {
  sendBtn.disabled = loading;
  if (loading) {
    sendBtn.innerHTML = '<span class="spinner"></span> Sending...';
  }
}

function resetButton() {
  sendBtn.disabled = false;
  sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
  hideStatus();
}

/* ==============================================================
   11. VIEW RESUME
   ============================================================== */
const viewResumeBtn = document.getElementById('viewResumeBtn');

if (viewResumeBtn) {
  viewResumeBtn.addEventListener('click', () => {
    window.open('resume.pdf', '_blank', 'noopener,noreferrer');
  });
}
