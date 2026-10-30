<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Compass, Home, Search } from '@lucide/vue'

const route = useRoute()
const router = useRouter()

const links = [
  { to: '/', label: 'Overview' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/projects', label: 'Projects' },
  { to: '/finance', label: 'Finance' },
]
</script>

<template>
  <div class="not-found">
    <div class="nf-visual" aria-hidden="true">
      <span class="nf-orb orb-a" />
      <span class="nf-orb orb-b" />
      <span class="nf-ring"><Search /></span>
      <p class="nf-code">404</p>
    </div>

    <div class="nf-copy">
      <p class="eyebrow"><Compass />Off the map</p>
      <h1>This page drifted away.</h1>
      <p class="nf-sub">
        We could not find <code class="nums">{{ route.path }}</code>. It may have moved, or the link might be a
        little out of date.
      </p>

      <div class="nf-actions">
        <RouterLink to="/" class="btn btn-primary"><Home />Back to overview</RouterLink>
        <button type="button" class="btn" @click="router.back()"><ArrowLeft />Go back</button>
      </div>

      <div class="nf-links">
        <span>Popular places</span>
        <RouterLink v-for="link in links" :key="link.to" :to="link.to">{{ link.label }}</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  align-items: center;
  gap: clamp(28px, 6vw, 64px);
  min-height: calc(100vh - 220px);
  padding: 24px 0;
}

.nf-visual {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 1 / 0.82;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  background: var(--surface);
  backdrop-filter: blur(18px);
  overflow: hidden;
}

.nf-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(2px);
  opacity: 0.65;
}

.orb-a {
  width: 190px;
  height: 190px;
  left: -50px;
  top: -60px;
  background: radial-gradient(circle at 35% 35%, var(--primary), transparent 68%);
}

.orb-b {
  width: 220px;
  height: 220px;
  right: -70px;
  bottom: -80px;
  background: radial-gradient(circle at 60% 40%, var(--accent), transparent 66%);
}

.nf-ring {
  position: absolute;
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  top: 18%;
  right: 16%;
  border-radius: 50%;
  border: 1px solid var(--border-strong);
  background: var(--surface-strong);
  color: var(--text-muted);
  box-shadow: var(--shadow-md);
  animation: float 6s var(--ease) infinite;
}

.nf-ring svg {
  width: 20px;
  height: 20px;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-9px) rotate(6deg);
  }
}

.nf-code {
  position: relative;
  font-family: var(--font-mono);
  font-size: clamp(92px, 16vw, 168px);
  font-weight: 600;
  letter-spacing: -0.08em;
  line-height: 1;
  background: linear-gradient(150deg, var(--primary) 0%, var(--accent) 72%, var(--primary-strong) 120%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: rise 0.6s var(--ease) both;
}

.nf-copy {
  animation: rise 0.6s var(--ease) 0.08s both;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.eyebrow svg {
  width: 13px;
  height: 13px;
}

.nf-copy h1 {
  margin-top: 10px;
  font-size: clamp(28px, 3.6vw, 40px);
  letter-spacing: -0.04em;
  line-height: 1.08;
}

.nf-sub {
  margin-top: 12px;
  max-width: 46ch;
  font-size: 13px;
  line-height: 1.65;
  color: var(--text-muted);
}

.nf-sub code {
  padding: 2px 6px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--surface-strong);
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text);
  overflow-wrap: anywhere;
}

.nf-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 22px;
}

.nf-links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 14px;
  margin-top: 28px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  font-size: 11px;
}

.nf-links > span {
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-faint);
}

.nf-links a {
  color: var(--text-muted);
  font-weight: 600;
  text-decoration: none;
}

.nf-links a:hover {
  color: var(--text);
  text-decoration: underline;
}

@media (max-width: 900px) {
  .not-found {
    grid-template-columns: minmax(0, 1fr);
    min-height: auto;
    padding: 12px 0;
  }

  .nf-visual {
    aspect-ratio: 16 / 9;
    max-height: 260px;
  }
}
</style>
