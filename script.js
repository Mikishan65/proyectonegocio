const root = document.documentElement;
const topbar = document.querySelector(".topbar");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const revealItems = document.querySelectorAll(".reveal");
const copyButtons = document.querySelectorAll("[data-copy]");
const tiltScenes = document.querySelectorAll("[data-tilt]");
const interactiveCards = document.querySelectorAll(
  ".hero-stats li, .benefit-band article, .service-card, .software-card, .software-benefits, .software-price, .benefit-card, .proposal-card, .process-step, .price-card, .side-card, .note-card, .terms-card, .contact-card",
);
const themeToggle = document.querySelector(".theme-toggle");
const themeToggleLabel = document.querySelector(".theme-toggle__label");
const themeColorMeta = document.querySelector("#theme-color-meta");
const yearTarget = document.querySelector("#current-year");
const sectionTargets = document.querySelectorAll("main section[id]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const hasFinePointer = window.matchMedia("(pointer: fine)");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
const themeStorageKey = "impulsapyme-theme";
let storedTheme = null;

try {
  storedTheme = window.localStorage.getItem(themeStorageKey);
} catch (error) {
  storedTheme = null;
}

const getThemeColor = () => getComputedStyle(root).getPropertyValue("--theme-color").trim();

const applyTheme = (theme, persist = true) => {
  root.dataset.theme = theme;

  if (themeToggle) {
    const isDark = theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));

    if (themeToggleLabel) {
      themeToggleLabel.textContent = isDark ? "Modo claro" : "Modo oscuro";
    }
  }

  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", getThemeColor());
  }

  if (persist) {
    try {
      window.localStorage.setItem(themeStorageKey, theme);
    } catch (error) {
      // Ignore storage failures and keep the theme in-memory only.
    }
  }
};

applyTheme(storedTheme || (prefersDarkScheme.matches ? "dark" : "light"), Boolean(storedTheme));

if (!storedTheme) {
  const handleSchemeChange = (event) => {
    applyTheme(event.matches ? "dark" : "light", false);
  };

  if (typeof prefersDarkScheme.addEventListener === "function") {
    prefersDarkScheme.addEventListener("change", handleSchemeChange);
  } else if (typeof prefersDarkScheme.addListener === "function") {
    prefersDarkScheme.addListener(handleSchemeChange);
  }
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  });
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -40px 0px" },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if ("IntersectionObserver" in window && navLinks.length > 0) {
  const navMap = new Map(Array.from(navLinks, (link) => [link.getAttribute("href"), link]));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const currentLink = navMap.get(`#${entry.target.id}`);

        navLinks.forEach((link) => link.classList.remove("is-active"));

        if (currentLink) {
          currentLink.classList.add("is-active");
        }
      });
    },
    {
      threshold: 0.35,
      rootMargin: "-20% 0px -55% 0px",
    },
  );

  sectionTargets.forEach((section) => sectionObserver.observe(section));
}

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy;

    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      const original = button.textContent;
      button.textContent = "Copiado";
      button.classList.add("is-copied");

      window.setTimeout(() => {
        button.textContent = original;
        button.classList.remove("is-copied");
      }, 1600);
    } catch (error) {
      button.textContent = value;
    }
  });
});

const syncHeaderState = () => {
  if (!topbar) {
    return;
  }

  topbar.classList.toggle("is-scrolled", window.scrollY > 18);
};

window.addEventListener("scroll", syncHeaderState, { passive: true });
syncHeaderState();

const attachTilt = (element, options = {}) => {
  const baseX = Number(element.dataset.tiltBaseX ?? options.baseX ?? 0);
  const baseY = Number(element.dataset.tiltBaseY ?? options.baseY ?? 0);
  const rangeX = Number(element.dataset.tiltRangeX ?? options.rangeX ?? 10);
  const rangeY = Number(element.dataset.tiltRangeY ?? options.rangeY ?? 12);

  element.addEventListener("mousemove", (event) => {
    const rect = element.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
    const rotateX = baseX - offsetY * rangeX;
    const rotateY = baseY + offsetX * rangeY;

    element.style.setProperty("--tilt-x", `${rotateX}deg`);
    element.style.setProperty("--tilt-y", `${rotateY}deg`);
  });

  element.addEventListener("mouseleave", () => {
    element.style.setProperty("--tilt-x", `${baseX}deg`);
    element.style.setProperty("--tilt-y", `${baseY}deg`);
  });
};

const attachCardTilt = (element) => {
  element.addEventListener("mousemove", (event) => {
    const rect = element.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
    const rotateX = offsetY * -10;
    const rotateY = offsetX * 12;

    element.classList.add("is-tilting");
    element.style.setProperty("--card-rotate-x", `${rotateX}deg`);
    element.style.setProperty("--card-rotate-y", `${rotateY}deg`);
  });

  element.addEventListener("mouseleave", () => {
    element.classList.remove("is-tilting");
    element.style.setProperty("--card-rotate-x", "0deg");
    element.style.setProperty("--card-rotate-y", "0deg");
  });
};

if (!prefersReducedMotion.matches && hasFinePointer.matches) {
  tiltScenes.forEach((scene) => attachTilt(scene, { baseX: -12, baseY: 18, rangeX: 14, rangeY: 18 }));
  interactiveCards.forEach((card) => attachCardTilt(card));
}

if (yearTarget) {
  yearTarget.textContent = String(new Date().getFullYear());
}
