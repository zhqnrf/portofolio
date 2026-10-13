<script setup lang="ts">
// Logo @ berkuping kucing. Saat di-hover / diklik, simbol @ berubah jadi wajah kucing.
const props = withDefaults(defineProps<{ size?: number; interactive?: boolean }>(), {
  size: 56,
  interactive: true,
})

const gid = `logo-grad-${useId()}`
const meow = ref(false)
let t: ReturnType<typeof setTimeout> | undefined

function poke() {
  if (!props.interactive) return
  meow.value = true
  clearTimeout(t)
  t = setTimeout(() => (meow.value = false), 1400)
}
</script>

<template>
  <span
    class="logo-cat"
    :class="{ interactive, awake: meow }"
    :style="{ width: `${size}px`, height: `${size * 1.12}px` }"
    @click="poke"
  >
    <svg viewBox="0 0 100 112" role="img" aria-label="Logo Zhaqian">
      <defs>
        <linearGradient :id="gid" x1="0" y1="10" x2="0" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#0a583e" />
          <stop offset="0.55" stop-color="#0b7068" />
          <stop offset="1" stop-color="#05718d" />
        </linearGradient>
      </defs>

      <g :stroke="`url(#${gid})`" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <!-- Telinga -->
        <path class="ear ear-l" d="M21 38 L23 12 L43 24 Z" stroke-width="6.5" fill="#ffffff" />
        <path class="ear ear-r" d="M79 38 L77 12 L57 24 Z" stroke-width="6.5" fill="#ffffff" />

        <!-- Isi kepala (muncul saat jadi kucing) -->
        <circle class="head-fill" cx="50" cy="55" r="32" fill="#ffffff" stroke="none" />

        <!-- Lingkar luar @ -->
        <path d="M86 55 A36 36 0 1 0 73.1 82.6" stroke-width="8" />

        <!-- Ekor -->
        <path class="tail" d="M52 91 Q45 97 51 101 Q57 105 50 110" stroke-width="3" />

        <!-- Bagian dalam @ -->
        <g class="at">
          <circle cx="49" cy="55" r="11" stroke-width="7.5" />
          <path d="M61 42 V59 Q61 68 70 68 Q83 68 86 55" stroke-width="7.5" />
        </g>

        <!-- Wajah kucing -->
        <g class="face">
          <g class="eyes" :fill="`url(#${gid})`" stroke="none">
            <ellipse cx="38" cy="52" rx="4.6" ry="6.2" />
            <ellipse cx="62" cy="52" rx="4.6" ry="6.2" />
          </g>
          <g fill="#ffffff" stroke="none" class="shine">
            <circle cx="39.6" cy="49.6" r="1.6" />
            <circle cx="63.6" cy="49.6" r="1.6" />
          </g>
          <path d="M46.5 62 H53.5 L50 66 Z" :fill="`url(#${gid})`" stroke-width="1.5" />
          <path d="M50 66 Q47 71 43 68.5 M50 66 Q53 71 57 68.5" stroke-width="2.4" />
          <path class="whiskers" d="M30 61 L13 57 M30 65.5 L12 66.5 M70 61 L87 57 M70 65.5 L88 66.5" stroke-width="2" />
        </g>
      </g>
    </svg>
    <span v-if="interactive" class="bubble" aria-hidden="true">meow!</span>
  </span>
</template>

<style scoped>
.logo-cat { position: relative; display: inline-block; flex: none; }
.logo-cat.interactive { cursor: pointer; }
svg { width: 100%; height: 100%; display: block; overflow: visible; }

.ear, .at, .face, .tail, .head-fill, .eyes, .whiskers {
  transform-box: fill-box;
  transition: opacity .3s ease, transform .35s cubic-bezier(.3, 1.5, .5, 1);
}
.ear-l { transform-origin: 100% 100%; }
.ear-r { transform-origin: 0% 100%; }
.tail { transform-origin: 50% 0%; }
.at { transform-origin: center; }
.face { opacity: 0; transform-origin: center; transform: scale(.6); }
.head-fill { opacity: 0; }
.eyes { transform-origin: center; }

/* Jadi kucing */
.interactive:hover .at,
.awake .at { opacity: 0; transform: scale(.4) rotate(-90deg); }
.interactive:hover .face,
.awake .face { opacity: 1; transform: scale(1); }
.interactive:hover .head-fill,
.awake .head-fill { opacity: 1; }
.interactive:hover .ear-l,
.awake .ear-l { animation: ear-l .9s ease-in-out infinite; }
.interactive:hover .ear-r,
.awake .ear-r { animation: ear-r .9s ease-in-out infinite .15s; }
.interactive:hover .tail,
.awake .tail { animation: wag .6s ease-in-out infinite alternate; }
.interactive:hover .eyes,
.awake .eyes { animation: blink 2.4s infinite .6s; }
.interactive:hover .whiskers,
.awake .whiskers { animation: twitch 1.8s ease-in-out infinite; }

@keyframes ear-l { 0%, 60%, 100% { transform: rotate(0); } 75% { transform: rotate(-12deg); } }
@keyframes ear-r { 0%, 60%, 100% { transform: rotate(0); } 75% { transform: rotate(12deg); } }
@keyframes wag { from { transform: rotate(-18deg); } to { transform: rotate(18deg); } }
@keyframes blink { 0%, 90%, 100% { transform: scaleY(1); } 95% { transform: scaleY(.1); } }
@keyframes twitch { 0%, 80%, 100% { transform: translateY(0); } 88% { transform: translateY(-1.2px); } }

.bubble {
  position: absolute;
  left: 92%;
  top: -6px;
  font-family: var(--f-mono);
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  color: var(--ink);
  background: var(--bg);
  border: 1.5px solid var(--ink);
  border-radius: 8px 8px 8px 2px;
  padding: 2px 7px;
  opacity: 0;
  transform: translateY(4px) scale(.9);
  transform-origin: left bottom;
  transition: opacity .2s, transform .2s;
  pointer-events: none;
}
.awake .bubble { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  .ear, .tail, .eyes, .whiskers { animation: none !important; }
}
</style>
