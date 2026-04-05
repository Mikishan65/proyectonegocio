const renderHomeBubbles = () => `
  <nav class="home-bubble-nav reveal" aria-label="Páginas del sitio">
    <div class="home-bubble-nav__stack">
      <button
        class="home-bubble-nav__item is-active"
        type="button"
        data-preview-trigger
        data-preview-id="home"
        data-preview-url="index.html"
        data-preview-label="Volver al inicio"
        data-preview-status="Inicio activo"
        aria-pressed="true"
      >
        Inicio
      </button>

      <button
        class="home-bubble-nav__item"
        type="button"
        data-preview-trigger
        data-preview-id="marketing"
        data-preview-url="marketing.html"
        data-preview-label="Abrir marketing"
        data-preview-status="Vista activa · Marketing"
        aria-pressed="false"
      >
        Marketing
      </button>

      <button
        class="home-bubble-nav__item"
        type="button"
        data-preview-trigger
        data-preview-id="software"
        data-preview-url="software.html"
        data-preview-label="Abrir sistemas"
        data-preview-status="Vista activa · Sistemas"
        aria-pressed="false"
      >
        Sistemas
      </button>

      <button
        class="home-bubble-nav__item"
        type="button"
        data-preview-trigger
        data-preview-id="design"
        data-preview-url="diseno.html"
        data-preview-label="Abrir diseño"
        data-preview-status="Vista activa · Diseño"
        aria-pressed="false"
      >
        Diseño
      </button>
    </div>
  </nav>
`;

export const renderSiteBubbles = (currentPage) =>
  currentPage === "home" ? renderHomeBubbles() : "";
