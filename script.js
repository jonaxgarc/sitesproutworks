const navToggle = document.querySelector(".nav-toggle");
const siteMenu = document.querySelector("#site-menu");
const revealTargets = document.querySelectorAll(
  ".section-heading, .notification-stack, .problem-card, .service-card, .proof-card, .package-card, .care-plan-row, .flow-step, .process-grid article, .contact-copy, .contact-form"
);

if (navToggle && siteMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.14 }
  );

  revealTargets.forEach((target, index) => {
    target.classList.add("reveal");
    target.style.transitionDelay = `${Math.min(index % 6, 5) * 45}ms`;
    observer.observe(target);
  });
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}
