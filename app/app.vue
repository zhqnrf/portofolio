<template>
  <NuxtPage />
  <!-- Tombol tema yang selalu menempel di pojok kanan atas -->
  <ClientOnly>
    <div class="theme-fab">
      <ThemeToggle />
    </div>
  </ClientOnly>
</template>

<style>
.theme-fab {
  position: fixed;
  top: calc(16px + env(safe-area-inset-top, 0px));
  right: 16px;
  z-index: 60;
  border-radius: 999px;
  box-shadow: 0 6px 20px -8px rgba(0, 0, 0, .25);
}
@media (min-width: 1024px) {
  .theme-fab { top: calc(24px + env(safe-area-inset-top, 0px)); right: 24px; }
}
</style>
