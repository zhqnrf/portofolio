<template>
  <NuxtPage />
  <!-- Bahasa & tema, selalu menempel di pojok atas -->
  <ClientOnly>
    <div class="top-controls">
      <LangSwitcher />
      <span class="fab"><ThemeToggle /></span>
    </div>
  </ClientOnly>
</template>

<style>
.top-controls {
  position: fixed;
  top: calc(16px + env(safe-area-inset-top, 0px));
  inset-inline-end: 16px;
  z-index: 60;
  display: flex;
  align-items: center;
  gap: 8px;
}
.top-controls > * { border-radius: 999px; box-shadow: 0 6px 20px -8px rgba(0, 0, 0, .25); }
@media (min-width: 1024px) {
  .top-controls { top: calc(24px + env(safe-area-inset-top, 0px)); inset-inline-end: 24px; }
}
</style>
