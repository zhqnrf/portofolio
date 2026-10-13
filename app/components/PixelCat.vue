<script setup lang="ts">
// Kucing pixel yang mengejar kursor, duduk saat kursor diam, lalu tidur kalau lama tidak bergerak.
// # badan (gradasi), e mata, p hidung
const SPRITES: Record<string, string[]> = {
  run1: [
    '..........#..#..',
    '..........####..',
    '#.........#e###.',
    '.#........#####p',
    '..#############.',
    '...###########..',
    '...###########..',
    '...##.....##....',
    '..##.......##...',
  ],
  run2: [
    '..........#..#..',
    '..........####..',
    '..........#e###.',
    '##........#####p',
    '..#############.',
    '...###########..',
    '...###########..',
    '....##...##.....',
    '....##...##.....',
  ],
  sit: [
    '..........#..#..',
    '..........####..',
    '..........#e###.',
    '..........#####p',
    '........######..',
    '.......#######..',
    '#......#######..',
    '.#.....#######..',
    '..######.##.##..',
  ],
  sleep: [
    '................',
    '..........#..#..',
    '..........####..',
    '..........#####.',
    '.....##########p',
    '...############.',
    '#..############.',
    '.#.############.',
    '..############..',
  ],
}
const W = 16
const H = 9
const SCALE = 3

const canvas = ref<HTMLCanvasElement | null>(null)
const wrap = ref<HTMLElement | null>(null)
const state = ref<'run' | 'sit' | 'sleep'>('sit')
const enabled = ref(false)

let raf = 0

onMounted(() => {
  const fine = matchMedia('(pointer: fine)').matches
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!fine || reduce) return
  enabled.value = true

  nextTick(() => {
    const ctx = canvas.value!.getContext('2d')!
    const grad = ctx.createLinearGradient(0, 0, 0, H)
    grad.addColorStop(0, '#0a583e')
    grad.addColorStop(0.55, '#0b7068')
    grad.addColorStop(1, '#05718d')

    function draw(name: string) {
      ctx.clearRect(0, 0, W, H)
      SPRITES[name]!.forEach((row, y) =>
        [...row].forEach((c, x) => {
          if (c === '.') return
          ctx.fillStyle = c === '#' ? grad : '#0b0f0e'
          ctx.fillRect(x, y, 1, 1)
        }),
      )
    }

    // Posisi kucing (titik tengah bawah) dan target
    let x = window.innerWidth - 80
    let y = window.innerHeight - 40
    let tx = x
    let ty = y
    let face = 1
    let lastMove = performance.now()
    let frameT = 0
    let frame = 0
    let last = performance.now()
    let currentSprite = ''

    const onMove = (e: PointerEvent) => {
      // Kucing berhenti sedikit di belakang kursor
      tx = e.clientX
      ty = e.clientY + 26
      lastMove = performance.now()
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    function tick(now: number) {
      const dt = Math.min(now - last, 50)
      last = now
      const dx = tx - x
      const dy = ty - y
      const dist = Math.hypot(dx, dy)
      const STOP = 34

      if (dist > STOP) {
        const speed = Math.min(0.55 * dt, dist - STOP) // px per frame
        x += (dx / dist) * speed
        y += (dy / dist) * speed
        if (Math.abs(dx) > 2) face = dx > 0 ? 1 : -1
        state.value = 'run'
        frameT += dt
        if (frameT > 110) { frame ^= 1; frameT = 0 }
      } else {
        state.value = now - lastMove > 6000 ? 'sleep' : 'sit'
      }

      const sprite = state.value === 'run' ? (frame ? 'run2' : 'run1') : state.value
      if (sprite !== currentSprite) { draw(sprite); currentSprite = sprite }

      if (wrap.value) {
        wrap.value.style.transform = `translate3d(${x - (W * SCALE) / 2}px, ${y - H * SCALE}px, 0)`
        wrap.value.style.setProperty('--face', String(face))
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    cleanup = () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  })
})

let cleanup = () => {}
onBeforeUnmount(() => cleanup())
</script>

<template>
  <div v-if="enabled" ref="wrap" class="pixel-cat" :class="state" aria-hidden="true">
    <span class="flip">
      <canvas ref="canvas" :width="W" :height="H" :style="{ width: `${W * SCALE}px`, height: `${H * SCALE}px` }" />
    </span>
    <span class="zzz">z<small>z</small></span>
  </div>
</template>

<style scoped>
.pixel-cat {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 60;
  pointer-events: none;
  will-change: transform;
}
.flip { display: block; transform: scaleX(var(--face, 1)); }
canvas { display: block; image-rendering: pixelated; }
.pixel-cat.sit canvas { animation: breathe 2.4s ease-in-out infinite; transform-origin: bottom; }
.pixel-cat.sleep canvas { animation: breathe 3.2s ease-in-out infinite; transform-origin: bottom; }
@keyframes breathe { 50% { transform: scaleY(1.06); } }

.zzz {
  position: absolute;
  right: 2px;
  top: -14px;
  font-family: var(--f-mono);
  font-size: 12px;
  font-weight: 500;
  color: var(--teal);
  opacity: 0;
  transition: opacity .4s;
}
.zzz small { font-size: 9px; margin-left: 1px; vertical-align: super; }
.pixel-cat.sleep .zzz { opacity: 1; animation: float 2s ease-in-out infinite; }
@keyframes float { 50% { transform: translateY(-4px); } }
</style>
