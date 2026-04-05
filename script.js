import { renderSiteTopbar } from "./components/site-topbar.js";
import { renderSiteBubbles } from "./components/site-bubbles.js";

const root = document.documentElement;
const currentPage = document.body.dataset.page || "home";
const isEmbeddedFrame = window.self !== window.top;

document.querySelectorAll("[data-site-topbar]").forEach((mount) => {
  if (isEmbeddedFrame) {
    mount.remove();
    return;
  }

  mount.outerHTML = renderSiteTopbar(currentPage);
});

document.querySelectorAll("[data-site-bubbles]").forEach((mount) => {
  if (isEmbeddedFrame) {
    mount.remove();
    return;
  }

  mount.outerHTML = renderSiteBubbles(currentPage);
});

if (isEmbeddedFrame) {
  root.dataset.embeddedFrame = "true";
  document.body.dataset.embeddedFrame = "true";
}

const topbar = document.querySelector(".topbar");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const inPageNavLinks = navLinks.filter((link) => {
  const href = link.getAttribute("href");
  return Boolean(href) && href.startsWith("#");
});
const revealItems = document.querySelectorAll(".reveal");
const copyButtons = document.querySelectorAll("[data-copy]");
const tiltScenes = document.querySelectorAll("[data-tilt]");
const rotatingWordGroups = document.querySelectorAll("[data-rotating-words]");
const designVideoShells = document.querySelectorAll(".design-video-shell");
const previewRoots = document.querySelectorAll("[data-preview-root]");
const interactiveCards = document.querySelectorAll(
  ".hero-stats li, .benefit-band article, .service-card, .software-card, .software-benefits, .software-price, .benefit-card, .proposal-card, .process-step, .price-card, .side-card, .note-card, .terms-card, .contact-card, .impact-card, .home-contrast__summary, .design-hero__metric, .design-video-shell, .home-lab-stat, .home-lab-list__item",
);
const themeToggle = document.querySelector(".theme-toggle");
const themeToggleLabel = document.querySelector(".theme-toggle__label");
const navToggleLabel = document.querySelector(".nav-toggle__label");
const themeColorMeta = document.querySelector("#theme-color-meta");
const homeLoader = document.querySelector("[data-home-loader]");
const yearTarget = document.querySelector("#current-year");
const boliviaTimeTargets = document.querySelectorAll("[data-bolivia-time]");
const boliviaDateTargets = document.querySelectorAll("[data-bolivia-date]");
const sectionTargets = document.querySelectorAll("main section[id]");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);
const hasFinePointer = window.matchMedia("(pointer: fine)");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
const themeStorageKey = "impulsapyme-theme";
let storedTheme = null;
let lastScrollY = window.scrollY;
let boliviaClockTimer = 0;
let homeLoaderHideTimer = 0;
let homeLoaderProgressTimer = 0;
let homeLoaderToken = 0;
let routeTransitionTimer = 0;

try {
  storedTheme = window.localStorage.getItem(themeStorageKey);
} catch (error) {
  storedTheme = null;
}

const getThemeColor = () =>
  getComputedStyle(root).getPropertyValue("--theme-color").trim();

const startHomeLoader = () => {
  if (!homeLoader) {
    return "";
  }

  homeLoaderToken += 1;
  window.clearTimeout(homeLoaderHideTimer);
  window.clearTimeout(homeLoaderProgressTimer);
  homeLoader.classList.add("is-visible");
  root.style.setProperty("--home-loader-scale", "0.12");

  window.requestAnimationFrame(() => {
    root.style.setProperty("--home-loader-scale", "0.68");
  });

  homeLoaderProgressTimer = window.setTimeout(() => {
    root.style.setProperty("--home-loader-scale", "0.9");
  }, 180);

  return String(homeLoaderToken);
};

const stopHomeLoader = () => {
  if (!homeLoader) {
    return;
  }

  window.clearTimeout(homeLoaderProgressTimer);
  root.style.setProperty("--home-loader-scale", "1");

  homeLoaderHideTimer = window.setTimeout(() => {
    homeLoader.classList.remove("is-visible");
    root.style.setProperty("--home-loader-scale", "0");
  }, 240);
};

const syncPreviewFrameState = (
  frame,
  {
    theme = root.dataset.theme || "light",
    resetScroll = false,
  } = {},
) => {
  if (!frame) {
    return;
  }

  frame.dataset.previewExpanded = "false";

  try {
    const frameRoot = frame.contentDocument?.documentElement;
    const frameBody = frame.contentDocument?.body;

    if (!frameRoot || !frameBody) {
      return;
    }

    frameRoot.dataset.theme = theme;
    frameRoot.dataset.previewEmbed = "true";
    frameRoot.dataset.previewExpanded = "false";
    frameRoot.dataset.embeddedFrame = "true";
    frameBody.dataset.previewEmbed = "true";
    frameBody.dataset.previewExpanded = "false";
    frameBody.dataset.embeddedFrame = "true";

    const frameThemeMeta =
      frame.contentDocument?.querySelector("#theme-color-meta");
    const frameThemeColor = frame.contentWindow
      ? frame.contentWindow
          .getComputedStyle(frameRoot)
          .getPropertyValue("--theme-color")
          .trim()
      : "";

    if (frameThemeMeta && frameThemeColor) {
      frameThemeMeta.setAttribute("content", frameThemeColor);
    }

    if (resetScroll) {
      frame.contentWindow?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  } catch (error) {
    // Ignore frames that are not ready yet.
  }
};

const syncEmbeddedThemes = (theme) => {
  document.querySelectorAll("iframe").forEach((frame) => {
    syncPreviewFrameState(frame, { theme });
  });
};

const bindPreviewFrameThemeSync = (frame) => {
  if (!frame || frame.dataset.themeSyncBound === "true") {
    return;
  }

  frame.dataset.themeSyncBound = "true";
  frame.addEventListener("load", () => {
    frame.dataset.previewReady = "true";
    syncPreviewFrameState(frame, {
      theme: root.dataset.theme || "light",
      resetScroll: true,
    });
  });
};

document.querySelectorAll("iframe").forEach((frame) => {
  bindPreviewFrameThemeSync(frame);
});

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

  syncEmbeddedThemes(theme);

  if (persist) {
    try {
      window.localStorage.setItem(themeStorageKey, theme);
    } catch (error) {
      // Ignore storage failures and keep the theme in-memory only.
    }
  }
};

applyTheme(
  storedTheme || (prefersDarkScheme.matches ? "dark" : "light"),
  Boolean(storedTheme),
);

navLinks.forEach((link) => {
  const isCurrentPage = link.dataset.page === currentPage;
  link.classList.toggle("is-active", isCurrentPage);

  if (isCurrentPage) {
    link.setAttribute("aria-current", "page");
  } else {
    link.removeAttribute("aria-current");
  }
});

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
  const setNavState = (isOpen) => {
    siteNav.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");

    if (navToggleLabel) {
      navToggleLabel.textContent = isOpen ? "Cerrar" : "Menú";
    }

    if (topbar) {
      topbar.classList.remove("is-hidden");
    }
  };

  navToggle.addEventListener("click", () => {
    const isOpen = !siteNav.classList.contains("is-open");
    setNavState(isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setNavState(false);
    });
  });
}

if (!isEmbeddedFrame && "IntersectionObserver" in window) {
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

if (
  !isEmbeddedFrame &&
  "IntersectionObserver" in window &&
  inPageNavLinks.length > 0
) {
  const navMap = new Map(
    Array.from(inPageNavLinks, (link) => [link.getAttribute("href"), link]),
  );

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const currentLink = navMap.get(`#${entry.target.id}`);

        inPageNavLinks.forEach((link) => {
          if (!link.dataset.page) {
            link.classList.remove("is-active");
          }
        });

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

const attachWordRotation = (container) => {
  const words = Array.from(container.querySelectorAll(".hero-word"));

  if (words.length === 0) {
    return;
  }

  const interval = Number(container.dataset.rotationInterval || 2400);
  let activeIndex = Math.max(
    0,
    words.findIndex((word) => word.classList.contains("is-active")),
  );

  const syncWidth = () => {
    const maxWidth = Math.ceil(
      words.reduce((widest, word) => Math.max(widest, word.scrollWidth), 0),
    );

    if (maxWidth > 0) {
      container.style.width = `${maxWidth}px`;
    }
  };

  const setActiveWord = (index) => {
    words.forEach((word, wordIndex) => {
      word.classList.toggle("is-active", wordIndex === index);
      word.setAttribute("aria-hidden", wordIndex === index ? "false" : "true");
    });
  };

  syncWidth();
  setActiveWord(activeIndex);
  window.addEventListener("resize", syncWidth, { passive: true });
  window.addEventListener("load", syncWidth, { once: true });

  if (isEmbeddedFrame || prefersReducedMotion.matches || words.length < 2) {
    return;
  }

  window.setInterval(() => {
    activeIndex = (activeIndex + 1) % words.length;
    setActiveWord(activeIndex);
  }, interval);
};

rotatingWordGroups.forEach((container) => attachWordRotation(container));

designVideoShells.forEach((shell) => {
  const video = shell.querySelector(".design-video-shell__media");

  if (!video) {
    return;
  }

  const source = video.querySelector("source");
  const sourceValue = source?.getAttribute("src")?.trim();
  const videoValue = video.getAttribute("src")?.trim();
  const hasSource = Boolean(sourceValue || videoValue);
  let visibilityObserver = null;

  const isPreviewOnly = () =>
    isEmbeddedFrame ||
    (document.body.dataset.previewEmbed === "true" &&
      document.body.dataset.previewExpanded !== "true");

  const requestVideo = () => {
    if (video.dataset.mediaRequested === "true") {
      return;
    }

    video.dataset.mediaRequested = "true";
    video.setAttribute("preload", "metadata");
    video.load();
  };

  const activateVideo = () => {
    if (!hasSource || isPreviewOnly()) {
      return;
    }

    shell.classList.add("is-ready");
    shell.classList.remove("is-deferred");
    video.setAttribute("controls", "");
    requestVideo();

    const playPromise = video.play();

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Ignore autoplay restrictions and leave controls available.
      });
    }
  };

  const releaseVideo = () => {
    video.pause();
    video.removeAttribute("controls");
    video.setAttribute("preload", "none");
    shell.classList.remove("is-ready");
    shell.classList.add("is-deferred");

    if (visibilityObserver) {
      visibilityObserver.disconnect();
      visibilityObserver = null;
    }
  };

  const observeVideoVisibility = () => {
    if (!hasSource || visibilityObserver || isPreviewOnly()) {
      return;
    }

    if (!("IntersectionObserver" in window) || prefersReducedMotion.matches) {
      activateVideo();
      return;
    }

    visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activateVideo();
          } else {
            video.pause();
          }
        });
      },
      {
        threshold: 0.32,
        rootMargin: "180px 0px",
      },
    );

    visibilityObserver.observe(shell);
  };

  const syncVideoMode = () => {
    if (!hasSource) {
      shell.classList.remove("is-ready", "is-deferred");
      return;
    }

    if (isPreviewOnly()) {
      releaseVideo();
      return;
    }

    shell.classList.remove("is-deferred");
    shell.classList.add("is-ready");
    observeVideoVisibility();
  };

  syncVideoMode();

  const shellStateObserver = new MutationObserver(syncVideoMode);
  shellStateObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ["data-preview-embed", "data-preview-expanded"],
  });
});

const loadPreviewFrame = (panel) => {
  const frame = panel?.querySelector("iframe");
  const previewSrc = frame?.dataset.previewSrc?.trim();
  const currentSrc = frame?.getAttribute("src")?.trim();

  bindPreviewFrameThemeSync(frame);

  if (!frame) {
    return;
  }

  if (currentSrc || !previewSrc) {
    return;
  }

  frame.setAttribute("src", previewSrc);
};

const attachPreviewHub = (rootElement) => {
  const triggers = Array.from(
    rootElement.querySelectorAll("[data-preview-trigger]"),
  );
  const panels = Array.from(
    rootElement.querySelectorAll("[data-preview-panel]"),
  );
  const status = rootElement.querySelector("[data-preview-status]");
  const previewLink = rootElement.querySelector("[data-preview-link]");
  const previewLinkLabel = rootElement.querySelector(
    "[data-preview-link-label]",
  );
  const defaultId =
    rootElement.dataset.previewDefaultId?.trim() ||
    triggers.find((trigger) => trigger.classList.contains("is-active"))?.dataset
      .previewId ||
    panels[0]?.dataset.previewPanel;
  const defaultStatus =
    rootElement.dataset.previewDefaultStatus?.trim() || "Inicio activo";
  const defaultUrl = rootElement.dataset.previewDefaultUrl?.trim() || "#";
  const defaultLabel =
    rootElement.dataset.previewDefaultLabel?.trim() || "Abrir vista";

  if (triggers.length === 0 || panels.length === 0) {
    return;
  }

  const panelMap = new Map(
    panels.map((panel) => [panel.dataset.previewPanel, panel]),
  );
  let activeId = defaultId;

  const setPreviewLinkState = (trigger) => {
    const nextUrl = trigger?.dataset.previewUrl?.trim() || defaultUrl;
    const isNavigable =
      Boolean(trigger?.dataset.previewId) &&
      trigger.dataset.previewId !== defaultId &&
      nextUrl !== "#";

    if (status) {
      status.textContent = trigger?.dataset.previewStatus || defaultStatus;
    }

    if (previewLink) {
      previewLink.setAttribute("href", isNavigable ? nextUrl : "#");
      previewLink.classList.toggle("is-disabled", !isNavigable);
      previewLink.setAttribute("aria-disabled", String(!isNavigable));
      previewLink.tabIndex = isNavigable ? 0 : -1;
    }

    if (previewLinkLabel) {
      previewLinkLabel.textContent =
        trigger?.dataset.previewLabel || defaultLabel;
    }
  };

  const navigateToPreview = (url, previewId = activeId) => {
    const nextUrl = url?.trim();

    if (
      !nextUrl ||
      nextUrl === "#" ||
      document.body.classList.contains("is-routing")
    ) {
      return;
    }

    window.clearTimeout(routeTransitionTimer);
    document.body.classList.add("is-routing");
    rootElement.dataset.routingTo = previewId || "";
    startHomeLoader();

    routeTransitionTimer = window.setTimeout(() => {
      document.body.classList.remove("is-routing");
      delete rootElement.dataset.routingTo;
      stopHomeLoader();
    }, 1800);

    window.setTimeout(() => {
      window.location.assign(nextUrl);
    }, prefersReducedMotion.matches ? 120 : 240);
  };

  const setActivePanel = (nextId) => {
    const nextPanel = panelMap.get(nextId);
    const nextTrigger = triggers.find(
      (trigger) => trigger.dataset.previewId === nextId,
    );

    if (!nextPanel) {
      return;
    }

    activeId = nextId;
    rootElement.dataset.activePreview = nextId;
    rootElement.dataset.previewSelection =
      nextId && nextId !== defaultId ? "selected" : "default";
    loadPreviewFrame(nextPanel);

    triggers.forEach((trigger) => {
      const isActive = trigger === nextTrigger;
      trigger.classList.toggle("is-active", isActive);
      trigger.setAttribute("aria-pressed", String(isActive));
    });

    panels.forEach((panel) => {
      const isActive = panel === nextPanel;
      panel.classList.toggle("is-active", isActive);
      panel.setAttribute("aria-hidden", String(!isActive));
    });

    setPreviewLinkState(nextTrigger);
  };

  triggers.forEach((trigger) => {
    const previewId = trigger.dataset.previewId;
    const previewUrl = trigger.dataset.previewUrl?.trim() || defaultUrl;

    if (!previewId) {
      return;
    }

    const activate = () => {
      setActivePanel(previewId);
    };

    trigger.addEventListener("pointerdown", () => {
      if (!previewId || previewId === defaultId) {
        return;
      }

      const targetPanel = panelMap.get(previewId);

      if (targetPanel) {
        loadPreviewFrame(targetPanel);
      }
    });

    trigger.addEventListener("mouseenter", activate);
    trigger.addEventListener("focus", activate);
    trigger.addEventListener("click", (event) => {
      event.preventDefault();

      if (previewId === defaultId) {
        setActivePanel(defaultId);
        return;
      }

      if (previewId === activeId) {
        navigateToPreview(previewUrl, previewId);
        return;
      }

      setActivePanel(previewId);
    });
  });

  if (previewLink) {
    previewLink.addEventListener("click", (event) => {
      if (previewLink.getAttribute("aria-disabled") === "true") {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      navigateToPreview(previewLink.getAttribute("href"), activeId);
    });
  }

  if (hasFinePointer.matches) {
    rootElement.addEventListener("mouseleave", () => {
      if (!document.body.classList.contains("is-routing")) {
        setActivePanel(defaultId);
      }
    });
  }

  rootElement.addEventListener("keydown", (event) => {
    const currentTrigger = event.target.closest("[data-preview-trigger]");

    if (!currentTrigger) {
      return;
    }

    const currentIndex = triggers.indexOf(currentTrigger);

    if (currentIndex < 0) {
      return;
    }

    let nextIndex = currentIndex;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % triggers.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = triggers.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    triggers[nextIndex].focus();
    setActivePanel(triggers[nextIndex].dataset.previewId);
  });

  if (activeId) {
    setActivePanel(activeId);
  }
};

previewRoots.forEach((previewRoot) => attachPreviewHub(previewRoot));

const attachHomeCursorGlow = () => {
  if (
    currentPage !== "home" ||
    prefersReducedMotion.matches ||
    !hasFinePointer.matches
  ) {
    return;
  }

  const setCursorState = (clientX, clientY, alpha = "1", scale = "1") => {
    document.body.style.setProperty("--home-cursor-x", `${clientX}px`);
    document.body.style.setProperty("--home-cursor-y", `${clientY}px`);
    document.body.style.setProperty("--home-cursor-alpha", alpha);
    document.body.style.setProperty("--home-cursor-scale", scale);
  };

  let cursorFrame = 0;
  let nextCursorX = window.innerWidth * 0.5;
  let nextCursorY = window.innerHeight * 0.5;

  const flushCursorState = () => {
    setCursorState(nextCursorX, nextCursorY, "1", "1");
    cursorFrame = 0;
  };

  window.addEventListener(
    "mousemove",
    (event) => {
      nextCursorX = event.clientX;
      nextCursorY = event.clientY;

      if (!cursorFrame) {
        cursorFrame = window.requestAnimationFrame(flushCursorState);
      }
    },
    { passive: true },
  );

  window.addEventListener("mouseleave", () => {
    document.body.style.setProperty("--home-cursor-alpha", "0");
    document.body.style.setProperty("--home-cursor-scale", "0.82");
  });
};

attachHomeCursorGlow();

if (boliviaTimeTargets.length > 0 || boliviaDateTargets.length > 0) {
  const boliviaTimeFormatter = new Intl.DateTimeFormat("es-BO", {
    timeZone: "America/La_Paz",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const boliviaDateFormatter = new Intl.DateTimeFormat("es-BO", {
    timeZone: "America/La_Paz",
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const syncBoliviaClock = () => {
    const now = new Date();
    const timeLabel = boliviaTimeFormatter.format(now);
    const dateLabel = `Santa Cruz · ${boliviaDateFormatter.format(now)}`;

    boliviaTimeTargets.forEach((target) => {
      target.textContent = timeLabel;
    });

    boliviaDateTargets.forEach((target) => {
      target.textContent = dateLabel;
    });
  };

  syncBoliviaClock();
  boliviaClockTimer = window.setInterval(syncBoliviaClock, 1000);
}

const syncHeaderState = () => {
  if (!topbar) {
    return;
  }

  const currentScrollY = window.scrollY;
  const isMenuOpen = Boolean(siteNav?.classList.contains("is-open"));
  const scrollingDown = currentScrollY > lastScrollY + 6;
  const scrollingUp = currentScrollY < lastScrollY - 6;
  const isHomeTopbar = currentPage === "home";

  topbar.classList.toggle("is-scrolled", currentScrollY > 18);
  topbar.classList.toggle(
    "is-condensed",
    currentScrollY > (isHomeTopbar ? 36 : 24),
  );

  if (isHomeTopbar) {
    if (currentScrollY <= 24 || scrollingUp) {
      topbar.classList.remove("is-hidden");
    } else if (scrollingDown && currentScrollY > 220) {
      topbar.classList.add("is-hidden");
    }

    lastScrollY = currentScrollY;
    return;
  }

  if (isMenuOpen || currentScrollY <= 24 || scrollingUp) {
    topbar.classList.remove("is-hidden");
  } else if (scrollingDown && currentScrollY > 120) {
    topbar.classList.add("is-hidden");
  }

  lastScrollY = currentScrollY;
};

window.addEventListener("scroll", syncHeaderState, { passive: true });
window.addEventListener("pageshow", () => {
  window.clearTimeout(routeTransitionTimer);
  document.body.classList.remove("is-routing");
  previewRoots.forEach((previewRoot) => {
    delete previewRoot.dataset.routingTo;
  });
  stopHomeLoader();
  syncHeaderState();
});
syncHeaderState();

const setSceneTilt = (element, rotateX, rotateY) => {
  element.style.setProperty("--tilt-x", `${rotateX}deg`);
  element.style.setProperty("--tilt-y", `${rotateY}deg`);
};

const getSceneTiltConfig = (element, options = {}) => {
  const baseX = Number(element.dataset.tiltBaseX ?? options.baseX ?? 0);
  const baseY = Number(element.dataset.tiltBaseY ?? options.baseY ?? 0);
  const rangeX = Number(element.dataset.tiltRangeX ?? options.rangeX ?? 10);
  const rangeY = Number(element.dataset.tiltRangeY ?? options.rangeY ?? 12);

  return { baseX, baseY, rangeX, rangeY };
};

const attachSceneMotion = (element, options = {}) => {
  const { baseX, baseY, rangeX, rangeY } = getSceneTiltConfig(element, options);
  let animationFrameId = 0;
  let isTouchInteracting = false;
  const scenePhase = Math.random() * Math.PI * 2;

  const updateFromPoint = (clientX, clientY) => {
    const rect = element.getBoundingClientRect();
    const offsetX = (clientX - rect.left) / rect.width - 0.5;
    const offsetY = (clientY - rect.top) / rect.height - 0.5;
    const rotateX = baseX - offsetY * rangeX;
    const rotateY = baseY + offsetX * rangeY;

    setSceneTilt(element, rotateX, rotateY);
  };

  setSceneTilt(element, baseX, baseY);

  if (hasFinePointer.matches) {
    element.addEventListener("mousemove", (event) => {
      const rect = element.getBoundingClientRect();
      const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
      const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
      const rotateX = baseX - offsetY * rangeX;
      const rotateY = baseY + offsetX * rangeY;

      setSceneTilt(element, rotateX, rotateY);
    });

    element.addEventListener("mouseleave", () => {
      setSceneTilt(element, baseX, baseY);
    });
  }

  if (!prefersReducedMotion.matches && !hasFinePointer.matches) {
    const autoAnimate = (time) => {
      if (!isTouchInteracting) {
        const seconds = time / 1000;
        const rotateX =
          baseX + Math.sin(seconds * 0.95 + scenePhase) * (rangeX * 0.35);
        const rotateY =
          baseY + Math.cos(seconds * 0.8 + scenePhase) * (rangeY * 0.45);

        setSceneTilt(element, rotateX, rotateY);
      }

      animationFrameId = window.requestAnimationFrame(autoAnimate);
    };

    animationFrameId = window.requestAnimationFrame(autoAnimate);
  }

  element.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.touches[0];

      if (!touch) {
        return;
      }

      isTouchInteracting = true;
      updateFromPoint(touch.clientX, touch.clientY);
    },
    { passive: true },
  );

  element.addEventListener(
    "touchmove",
    (event) => {
      const touch = event.touches[0];

      if (!touch) {
        return;
      }

      isTouchInteracting = true;
      updateFromPoint(touch.clientX, touch.clientY);
    },
    { passive: true },
  );

  element.addEventListener(
    "touchend",
    () => {
      isTouchInteracting = false;

      if (prefersReducedMotion.matches || hasFinePointer.matches) {
        setSceneTilt(element, baseX, baseY);
      }
    },
    { passive: true },
  );

  element.addEventListener(
    "touchcancel",
    () => {
      isTouchInteracting = false;

      if (prefersReducedMotion.matches || hasFinePointer.matches) {
        setSceneTilt(element, baseX, baseY);
      }
    },
    { passive: true },
  );

  return () => {
    if (animationFrameId) {
      window.cancelAnimationFrame(animationFrameId);
    }
  };
};

const attachCardTilt = (element) => {
  element.addEventListener("mousemove", (event) => {
    const rect = element.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
    const rotateX = offsetY * -10;
    const rotateY = offsetX * 12;
    const pointerX = `${((event.clientX - rect.left) / rect.width) * 100}%`;
    const pointerY = `${((event.clientY - rect.top) / rect.height) * 100}%`;

    element.classList.add("is-tilting");
    element.style.setProperty("--card-rotate-x", `${rotateX}deg`);
    element.style.setProperty("--card-rotate-y", `${rotateY}deg`);
    element.style.setProperty("--pointer-x", pointerX);
    element.style.setProperty("--pointer-y", pointerY);
    element.style.setProperty("--pointer-alpha", "1");
    element.style.setProperty("--pointer-scale", "1");
  });

  element.addEventListener("mouseleave", () => {
    element.classList.remove("is-tilting");
    element.style.setProperty("--card-rotate-x", "0deg");
    element.style.setProperty("--card-rotate-y", "0deg");
    element.style.setProperty("--pointer-alpha", "0");
    element.style.setProperty("--pointer-scale", "0.68");
  });
};

if (!isEmbeddedFrame && !prefersReducedMotion.matches && hasFinePointer.matches) {
  interactiveCards.forEach((card) => attachCardTilt(card));
}

if (!isEmbeddedFrame) {
  tiltScenes.forEach((scene) =>
    attachSceneMotion(scene, {
      baseX: -12,
      baseY: 18,
      rangeX: 14,
      rangeY: 18,
    }),
  );
}

if (yearTarget) {
  yearTarget.textContent = String(new Date().getFullYear());
}
