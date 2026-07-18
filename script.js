document.documentElement.classList.add("reveal-ready");

const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const navLinks = document.querySelectorAll("nav a[href^='#']");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
const noteFilterButtons = document.querySelectorAll("[data-note-filter]");
const noteCards = document.querySelectorAll("[data-note-category]");

document.querySelector("[data-year]").textContent = new Date().getFullYear();

const setMenu = (open) => {
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "关闭导航" : "打开导航");
  mobileNav.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
};

menuButton.addEventListener("click", () => {
  setMenu(menuButton.getAttribute("aria-expanded") !== "true");
});

mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

noteFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.noteFilter;

    noteFilterButtons.forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });

    noteCards.forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.noteCategory !== filter;
    });
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-25% 0px -65%", threshold: 0 }
);

sections.forEach((section) => sectionObserver.observe(section));

const directTarget = document.querySelector(window.location.hash || "#top");
directTarget?.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));

const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 24);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });
