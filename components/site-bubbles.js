const homeBubbleRoutes = [
  {
    id: "home",
    label: "Inicio",
    meta: "Chispa central",
    index: "00",
    previewUrl: "index.html",
    previewLabel: "Volver al inicio",
    previewStatus: "La idea sigue encendida",
    tone: "home",
    isActive: true,
  },
  {
    id: "marketing",
    label: "Marketing",
    meta: "Ruido con intención",
    index: "01",
    previewUrl: "marketing.html",
    previewLabel: "Abrir marketing",
    previewStatus: "Marketing en transmisión",
    tone: "marketing",
  },
  {
    id: "software",
    label: "Sistemas",
    meta: "Orden que responde",
    index: "02",
    previewUrl: "software.html",
    previewLabel: "Abrir sistemas",
    previewStatus: "Sistemas en transmisión",
    tone: "software",
  },
  {
    id: "design",
    label: "Diseño",
    meta: "Forma que atrae",
    index: "03",
    previewUrl: "diseno.html",
    previewLabel: "Abrir diseño",
    previewStatus: "Diseño en transmisión",
    tone: "design",
  },
];

const renderHomeBubbles = () => `
  <nav class="home-bubble-nav reveal" aria-label="Páginas del sitio">
    <div class="home-bubble-nav__stack">
      ${homeBubbleRoutes
        .map(
          ({
            id,
            label,
            meta,
            index,
            previewUrl,
            previewLabel,
            previewStatus,
            tone,
            isActive = false,
          }) => `
            <button
              class="home-bubble-nav__item${isActive ? " is-active" : ""}"
              type="button"
              data-preview-trigger
              data-preview-id="${id}"
              data-preview-url="${previewUrl}"
              data-preview-label="${previewLabel}"
              data-preview-status="${previewStatus}"
              data-bubble-tone="${tone}"
              aria-pressed="${isActive ? "true" : "false"}"
            >
              <span class="home-bubble-nav__index" aria-hidden="true">${index}</span>
              <span class="home-bubble-nav__copy">
                <span class="home-bubble-nav__label">${label}</span>
                <span class="home-bubble-nav__meta">${meta}</span>
              </span>
              <span class="home-bubble-nav__pulse" aria-hidden="true"></span>
            </button>
          `,
        )
        .join("")}
    </div>
  </nav>
`;

export const renderSiteBubbles = (currentPage) =>
  currentPage === "home" ? renderHomeBubbles() : "";
