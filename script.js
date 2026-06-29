const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const canAnimate = !prefersReducedMotion.matches;
const gsapReady = Boolean(window.gsap && canAnimate);

const navToggle = document.querySelector(".nav-toggle");
const siteMenu = document.querySelector("#site-menu");
const siteHeader = document.querySelector(".site-header");
const hero = document.querySelector(".hero");
const heroVisual = document.querySelector(".hero-visual");
const navLinks = Array.from(document.querySelectorAll(".site-menu a[href^='#']"));
const hashLinks = Array.from(document.querySelectorAll("a[href^='#']"));
const counterTargets = Array.from(document.querySelectorAll(".metric-number[data-count-to]"));

const revealTargets = Array.from(
  document.querySelectorAll(
    [
      ".local-trust-heading",
      ".niche-card",
      ".local-trust-card",
      ".lead-flow-card",
      ".conversion-shell",
      ".problem-copy",
      ".notification-stack",
      ".problem-card",
      ".section-heading",
      ".service-card",
      ".proof-card",
      ".flow-step",
      ".package-card",
      ".care-plan-row",
      ".process-grid article",
      ".check-card",
      ".faq-list details",
      ".contact-copy",
      ".contact-form",
    ].join(", ")
  )
);

if (gsapReady) {
  window.gsap.set(document.body, { autoAlpha: 0 });
}

// Mobile navigation: accessible toggle with animated menu items.
function closeMobileMenu() {
  if (!navToggle || !siteMenu) return;

  siteMenu.classList.remove("is-open");
  navToggle.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

if (navToggle && siteMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteMenu.classList.toggle("is-open");

    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Smooth anchor scrolling keeps navigation polished without changing URLs unexpectedly.
hashLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    const target = href && href.length > 1 ? document.getElementById(href.slice(1)) : null;

    if (!target) return;

    event.preventDefault();
    closeMobileMenu();
    target.scrollIntoView({ behavior: canAnimate ? "smooth" : "auto", block: "start" });
    window.history.pushState(null, "", href);
  });
});

// Page load and hero entrance animation powered by GSAP, with graceful fallback.
function runPageLoadAnimation() {
  if (!gsapReady) {
    document.body.style.opacity = "";
    return;
  }

  const gsap = window.gsap;
  const heroText = [
    ".hero .eyebrow",
    ".hero h1 span",
    ".hero-lede",
    ".hero-actions .button",
    ".hero-metrics > div",
  ];

  gsap.set(heroText, { autoAlpha: 0, y: 24 });
  gsap.set(".lead-flow-card", { autoAlpha: 0, x: 34, y: 18, scale: 0.97 });
  gsap.set(".hero-float", { autoAlpha: 0, y: 10 });

  const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

  timeline
    .to(document.body, { autoAlpha: 1, duration: 0.32, ease: "power1.out" })
    .to(".hero .eyebrow", { autoAlpha: 1, y: 0, duration: 0.48 }, "-=0.08")
    .to(".hero h1 span", { autoAlpha: 1, y: 0, duration: 0.72, stagger: 0.08 }, "-=0.18")
    .to(".hero-lede", { autoAlpha: 1, y: 0, duration: 0.58 }, "-=0.42")
    .to(".hero-actions .button", { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08 }, "-=0.34")
    .to(".hero-metrics > div", { autoAlpha: 1, y: 0, duration: 0.52, stagger: 0.08 }, "-=0.28")
    .to(".lead-flow-card", { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.92 }, "-=0.86")
    .to(".hero-float", { autoAlpha: 0.62, y: 0, duration: 0.6, stagger: 0.08 }, "-=0.68");

  gsap.to(".hero-float", {
    x: (index) => [8, -6, 5][index] || 4,
    y: (index) => [-10, 8, -7][index] || -5,
    duration: (index) => [4.8, 5.6, 4.2][index] || 5,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    stagger: 0.12,
  });

  gsap.to(".hero-actions .button.primary", {
    boxShadow: "0 18px 42px rgba(36, 114, 70, 0.22)",
    duration: 0.8,
    delay: 1.8,
    ease: "power2.out",
  });
}

// Intersection Observer reveals sections and staggered card groups as they enter view.
function setupRevealAnimations() {
  if (!("IntersectionObserver" in window) || !canAnimate) {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
  );

  revealTargets.forEach((target) => {
    const siblings = Array.from(target.parentElement?.children || []).filter((item) =>
      item.matches?.(".niche-card, .local-trust-card, .problem-card, .service-card, .proof-card, .flow-step, .package-card, .check-card, article, details")
    );
    const index = Math.max(0, siblings.indexOf(target));
    const delay = Math.min(index, 5) * 70;

    target.classList.add("reveal");
    target.style.setProperty("--reveal-delay", `${delay}ms`);
    observer.observe(target);
  });
}

// Animated counters for hero statistics.
function animateCounter(counter) {
  const endValue = Number(counter.dataset.countTo || counter.textContent);

  if (!Number.isFinite(endValue)) return;

  if (!gsapReady) {
    counter.textContent = String(endValue);
    return;
  }

  const counterState = { value: 0 };

  window.gsap.to(counterState, {
    value: endValue,
    duration: 1.15,
    ease: "power2.out",
    snap: { value: 1 },
    onUpdate: () => {
      counter.textContent = String(Math.round(counterState.value));
    },
  });
}

function setupCounters() {
  if (!counterTargets.length) return;

  if (!("IntersectionObserver" in window)) {
    counterTargets.forEach(animateCounter);
    return;
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.55 }
  );

  counterTargets.forEach((counter) => counterObserver.observe(counter));
}

// Sticky header state, active nav highlighting, and lightweight parallax.
let ticking = false;
const trackedSections = navLinks
  .map((link) => {
    const id = link.getAttribute("href")?.slice(1);
    const section = id ? document.getElementById(id) : null;
    return section ? { id, link, section } : null;
  })
  .filter(Boolean);

function setActiveLink(activeId) {
  trackedSections.forEach(({ id, link }) => {
    const isActive = id === activeId;

    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function updateScrollState() {
  const scrollY = window.scrollY || window.pageYOffset;

  siteHeader?.classList.toggle("is-scrolled", scrollY > 8);

  let activeId = "";
  const triggerLine = window.innerHeight * 0.38;

  trackedSections.forEach(({ id, section }) => {
    const rect = section.getBoundingClientRect();

    if (rect.top <= triggerLine && rect.bottom >= triggerLine) {
      activeId = id;
    }
  });

  setActiveLink(activeId);

  if (canAnimate && hero && heroVisual) {
    const heroRect = hero.getBoundingClientRect();

    if (heroRect.bottom > 0) {
      const parallaxY = Math.min(18, Math.max(0, scrollY * 0.035));
      heroVisual.style.setProperty("--hero-parallax-y", `${parallaxY}px`);
    }
  }

  ticking = false;
}

function requestScrollUpdate() {
  if (ticking) return;

  ticking = true;
  window.requestAnimationFrame(updateScrollState);
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);

runPageLoadAnimation();
setupRevealAnimations();
setupCounters();
updateScrollState();
