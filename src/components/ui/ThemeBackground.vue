<script setup lang="ts">
import { type CSSProperties } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { theme } = useTheme()

interface FloatingItem {
  style: CSSProperties
}

const petals: FloatingItem[] = Array.from({ length: 16 }, (_, index) => ({
  style: {
    left: `${(index * 37 + 11) % 100}%`,
    width: `${9 + (index % 4) * 3}px`,
    height: `${9 + (index % 4) * 3}px`,
    opacity: 0.3 + (index % 3) * 0.18,
    animationDelay: `${-(index * 1.9).toFixed(1)}s`,
    animationDuration: `${(13 + (index % 5) * 2).toFixed(1)}s`,
  },
}))

const stars: FloatingItem[] = Array.from({ length: 70 }, (_, index) => ({
  style: {
    left: `${(index * 61 + 7) % 100}%`,
    top: `${(index * 37 + 13) % 100}%`,
    width: index % 9 === 0 ? '2px' : '1px',
    height: index % 9 === 0 ? '2px' : '1px',
    animationDelay: `${-(index * 0.37).toFixed(2)}s`,
    animationDuration: `${(3 + (index % 6)).toFixed(1)}s`,
  },
}))

const meteors: FloatingItem[] = [
  { style: { left: '18%', top: '12%', animationDelay: '1.5s', animationDuration: '9s' } },
  { style: { left: '62%', top: '6%', animationDelay: '6.5s', animationDuration: '12s' } },
]

const bubbles: FloatingItem[] = Array.from({ length: 9 }, (_, index) => ({
  style: {
    left: `${8 + index * 11}%`,
    width: `${5 + (index % 4) * 4}px`,
    height: `${5 + (index % 4) * 4}px`,
    animationDelay: `${-(index * 2.4).toFixed(1)}s`,
    animationDuration: `${(11 + (index % 5) * 2).toFixed(1)}s`,
  },
}))
</script>

<template>
  <div class="scene" aria-hidden="true">
    <div class="scene-base" />
    <div class="orb orb-a" />
    <div class="orb orb-b" />
    <div class="orb orb-c" />

    <template v-if="theme === 'sakura'">
      <span v-for="(petal, index) in petals" :key="`petal-${index}`" class="petal" :style="petal.style" />
    </template>

    <template v-else-if="theme === 'space'">
      <span v-for="(star, index) in stars" :key="`star-${index}`" class="star" :style="star.style" />
      <span v-for="(meteor, index) in meteors" :key="`meteor-${index}`" class="meteor" :style="meteor.style" />
    </template>

    <template v-else>
      <span v-for="(bubble, index) in bubbles" :key="`bubble-${index}`" class="bubble" :style="bubble.style" />
      <div class="waves">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            class="wave wave-one"
            d="M0,192L60,181.3C120,171,240,149,360,160C480,171,600,213,720,218.7C840,224,960,192,1080,181.3C1200,171,1320,181,1380,186.7L1440,192L1440,320L0,320Z"
          />
          <path
            class="wave wave-two"
            d="M0,224L60,213.3C120,203,240,181,360,192C480,203,600,245,720,245.3C840,245,960,203,1080,192C1200,181,1320,203,1380,213.3L1440,224L1440,320L0,320Z"
          />
        </svg>
      </div>
    </template>

    <div class="scene-vignette" />
  </div>
</template>

<style scoped>
.scene {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.scene-base {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(120% 90% at 15% 0%, color-mix(in srgb, var(--glow-a) 32%, transparent), transparent 62%),
    radial-gradient(100% 80% at 92% 12%, color-mix(in srgb, var(--glow-b) 35%, transparent), transparent 60%),
    linear-gradient(180deg, var(--scene-top), var(--scene-bottom));
  transition: background var(--dur-slow) var(--ease);
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.55;
  will-change: transform;
  animation: drift 22s var(--ease) infinite alternate;
}

.orb-a {
  width: 46vw;
  height: 46vw;
  min-width: 320px;
  min-height: 320px;
  top: -14vw;
  left: -8vw;
  background: var(--glow-a);
}

.orb-b {
  width: 38vw;
  height: 38vw;
  min-width: 260px;
  min-height: 260px;
  top: 24%;
  right: -10vw;
  background: var(--glow-b);
  animation-duration: 27s;
  animation-delay: -6s;
}

.orb-c {
  width: 34vw;
  height: 34vw;
  min-width: 240px;
  min-height: 240px;
  bottom: -14vw;
  left: 32%;
  background: var(--glow-c);
  opacity: 0.4;
  animation-duration: 31s;
  animation-delay: -12s;
}

@keyframes drift {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    transform: translate3d(4vw, 3vh, 0) scale(1.12);
  }
}

.petal {
  position: absolute;
  top: -6%;
  border-radius: 72% 0 72% 0;
  background: linear-gradient(135deg, rgba(255, 222, 235, 0.95), rgba(244, 132, 173, 0.9));
  box-shadow: 0 4px 12px rgba(220, 100, 145, 0.25);
  animation-name: petal-fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: transform;
}

@keyframes petal-fall {
  0% {
    transform: translate3d(0, -10vh, 0) rotate(0deg);
  }
  50% {
    transform: translate3d(48px, 52vh, 0) rotate(200deg);
  }
  100% {
    transform: translate3d(-28px, 112vh, 0) rotate(420deg);
  }
}

.star {
  position: absolute;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
  animation: twinkle ease-in-out infinite;
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.15;
    transform: scale(0.8);
  }
  50% {
    opacity: 0.95;
    transform: scale(1.25);
  }
}

.meteor {
  position: absolute;
  width: 140px;
  height: 1px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.85), transparent);
  transform: rotate(-32deg);
  opacity: 0;
  animation-name: meteor-slide;
  animation-timing-function: ease-in;
  animation-iteration-count: infinite;
}

@keyframes meteor-slide {
  0% {
    opacity: 0;
    transform: translate3d(0, 0, 0) rotate(-32deg) scaleX(0.3);
  }
  6% {
    opacity: 0.9;
  }
  18% {
    opacity: 0;
    transform: translate3d(-38vw, 30vh, 0) rotate(-32deg) scaleX(1);
  }
  100% {
    opacity: 0;
  }
}

.bubble {
  position: absolute;
  bottom: -6%;
  border-radius: 50%;
  border: 1px solid rgba(142, 231, 240, 0.35);
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.35), transparent 60%);
  animation-name: bubble-rise;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: transform;
}

@keyframes bubble-rise {
  0% {
    transform: translate3d(0, 0, 0) scale(0.8);
    opacity: 0;
  }
  12% {
    opacity: 0.7;
  }
  100% {
    transform: translate3d(30px, -96vh, 0) scale(1.15);
    opacity: 0;
  }
}

.waves {
  position: absolute;
  inset: auto 0 -2% 0;
  height: 34vh;
  min-height: 200px;
}

.waves svg {
  width: 200%;
  height: 100%;
}

.wave {
  transform-origin: center bottom;
  animation: wave-slide 18s linear infinite;
}

.wave-one {
  fill: rgba(47, 212, 196, 0.1);
}

.wave-two {
  fill: rgba(79, 157, 247, 0.08);
  animation-duration: 26s;
  animation-direction: reverse;
}

@keyframes wave-slide {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

.scene-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(120% 100% at 50% 0%, transparent 55%, color-mix(in srgb, var(--scene-bottom) 72%, transparent));
  opacity: 0.8;
}

@media (prefers-reduced-motion: reduce) {
  .petal,
  .meteor {
    display: none;
  }
}
</style>
