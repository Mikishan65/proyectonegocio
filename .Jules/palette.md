## 2025-05-15 - Cinematic Navigation Shimmer
**Learning:** In a static multi-page architecture with a "cinematic" aesthetic, a 750ms intentional delay combined with a `.is-loading-link` shimmer effect successfully bridges the jarring gap between hard page loads. This provides a "SPA-like" feeling without the complexity of a client-side router, provided the visual feedback is immediate upon click.
**Action:** Use `requestAnimationFrame` and `setTimeout` to wrap internal navigation, applying a global loading state to the body or the triggered link to maintain perceived performance.

## 2025-05-15 - Dynamically Injected Skip-Links
**Learning:** For legacy or static multi-page sites where editing every header is high-risk, dynamically injecting a "Skip to Content" link as the first child of `<body>` via JS is an effective accessibility fallback. It ensures keyboard users have a consistent bypass block on every page without requiring manual HTML refactors.
**Action:** Target the first `main` or element with `id="main"` to ensure the skip-link has a meaningful destination.
