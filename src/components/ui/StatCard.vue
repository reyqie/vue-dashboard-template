<script setup lang="ts">
import { computed, type Component } from 'vue'
import { ArrowDownRight, ArrowUpRight } from '@lucide/vue'
import Sparkline from './Sparkline.vue'
import { useCountUp } from '@/composables/useCountUp'

const props = withDefaults(
  defineProps<{
    label: string
    value: number
    icon: Component
    data: number[]
    delta: number
    prefix?: string
    suffix?: string
    decimals?: number
    invertDelta?: boolean
    tone?: 'primary' | 'accent' | 'success' | 'warning'
  }>(),
  { prefix: '', suffix: '', decimals: 0, invertDelta: false, tone: 'primary' },
)

const display = useCountUp(() => props.value)
const toneColor = computed(() => {
  const map = {
    primary: 'var(--primary)',
    accent: 'var(--accent)',
    success: 'var(--success)',
    warning: 'var(--warning)',
  } as const
  return map[props.tone]
})

const formatted = computed(() =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: props.decimals,
    maximumFractionDigits: props.decimals,
  }).format(display.value),
)

const deltaState = computed(() => {
  const effective = props.invertDelta ? -props.delta : props.delta
  if (Math.abs(props.delta) < 0.05) return 'neutral'
  return effective > 0 ? 'good' : 'bad'
})
</script>

<template>
  <article class="stat card card-hover">
    <div class="stat-top">
      <span class="stat-icon" :style="{ '--tone': toneColor }">
        <component :is="icon" />
      </span>
      <span class="stat-label">{{ label }}</span>
    </div>
    <p class="stat-value nums">{{ prefix }}{{ formatted }}{{ suffix }}</p>
    <div class="stat-bottom">
      <span class="delta" :data-state="deltaState">
        <component :is="delta >= 0 ? ArrowUpRight : ArrowDownRight" />
        {{ Math.abs(delta).toFixed(1) }}%
      </span>
      <span class="stat-note">vs last period</span>
      <Sparkline class="stat-spark" :data="data" :color="toneColor" :width="110" :height="34" />
    </div>
  </article>
</template>

<style scoped>
.stat {
  padding: 18px 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: hidden;
}

.stat-top {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-icon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: 11px;
  color: var(--tone);
  background: color-mix(in srgb, var(--tone) 13%, transparent);
  border: 1px solid color-mix(in srgb, var(--tone) 18%, transparent);
}

.stat-icon :deep(svg) {
  width: 17px;
  height: 17px;
}

.stat-label {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text-muted);
}

.stat-value {
  font-size: clamp(24px, 2.4vw, 30px);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.045em;
}

.stat-bottom {
  display: flex;
  align-items: center;
  gap: 7px;
  min-height: 34px;
}

.delta {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 3px 7px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  font-family: var(--font-mono);
  background: color-mix(in srgb, var(--text-faint) 14%, transparent);
  color: var(--text-muted);
}

.delta svg {
  width: 12px;
  height: 12px;
}

.delta[data-state='good'] {
  background: color-mix(in srgb, var(--success) 14%, transparent);
  color: var(--success);
}

.delta[data-state='bad'] {
  background: color-mix(in srgb, var(--danger) 14%, transparent);
  color: var(--danger);
}

.stat-note {
  font-size: 11px;
  color: var(--text-faint);
}

.stat-spark {
  width: 96px;
  margin-left: auto;
  flex: none;
  opacity: 0.9;
}

@media (max-width: 520px) {
  .stat-spark {
    width: 72px;
  }
}
</style>
