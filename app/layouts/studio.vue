<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'it' },
  bodyAttrs: { class: 'studio-body' },
})
</script>

<template>
  <div class="studio-root">
    <slot />
  </div>
</template>

<style>
.studio-body {
  background: #0A0A0A;
  color: #F5F1E8;
}

.studio-root {
  --studio-bg: #0A0A0A;
  --studio-fg: #F5F1E8;
  --studio-accent: #C73E1D;
  --studio-muted: rgba(245, 241, 232, 0.6);
  --studio-dim: rgba(245, 241, 232, 0.4);

  background: var(--studio-bg);
  color: var(--studio-fg);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  min-height: 100dvh;
  width: 100%;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

.studio-root *::selection {
  background: var(--studio-accent);
  color: var(--studio-fg);
}

.studio-root :focus-visible {
  outline: 2px solid var(--studio-accent);
  outline-offset: 3px;
}
</style>
