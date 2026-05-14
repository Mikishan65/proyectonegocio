export const renderSiteLoader = () => {
  return `
    <div class="site-loader" id="site-loader" aria-hidden="true">
      <div class="site-loader__content">
        <div class="site-loader__logo">
          <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" class="site-loader__svg">
            <g class="site-loader__lines" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 35h28l4 9H16z" class="line-1" />
              <path d="M22 35v-9h24v9" class="line-2" />
              <path d="M18 44v25h34V44" class="line-3" />
              <path d="M31 69V56h10v13" class="line-4" />
              <path d="M46 60l10-10 9 7 13-19" class="line-5" />
              <path d="M70 38h9v9" class="line-6" />
            </g>
            <g class="site-loader__dots" fill="currentColor">
              <circle cx="46" cy="60" r="2" />
              <circle cx="56" cy="50" r="2" />
              <circle cx="65" cy="57" r="2" />
            </g>
          </svg>
        </div>
        <div class="site-loader__progress">
          <div class="site-loader__bar"></div>
        </div>
        <p class="site-loader__text">Iniciando sistema...</p>
      </div>
    </div>
  `;
};
