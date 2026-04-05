export const renderSiteTopbar = (currentPage) => {
  const topbarClass = currentPage === "home" ? "topbar topbar--home" : "topbar";
  const brandClass = currentPage === "home" ? "brand brand--home" : "brand";

  return `
    <header class="${topbarClass}">
      <a class="${brandClass}" href="index.html" aria-label="Ir al inicio">
        <span class="brand-mark" aria-hidden="true">
          <img src="assets/brand-mark.svg" alt="" />
        </span>
        <span class="brand-copy">
          <strong>ImpulsaPyME</strong>
          <small>Marketing, sistemas y diseño para empresas de cualquier rubro</small>
        </span>
      </a>

      <div class="topbar-actions">
        <span class="site-presence" aria-label="Bolivia">
          <span class="site-presence__flag" aria-hidden="true"></span>
          <span class="site-presence__time" data-bolivia-time>00:00</span>
        </span>

        <button
          class="theme-toggle"
          type="button"
          aria-label="Cambiar tema"
          aria-pressed="false"
        >
          <span class="theme-toggle__track">
            <span class="theme-toggle__thumb"></span>
          </span>
          <span class="theme-toggle__label">Modo oscuro</span>
        </button>
      </div>
    </header>
  `;
};
