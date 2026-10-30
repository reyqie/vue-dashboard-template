<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue'
import type { DonutSegment } from '@/types'

const props = withDefaults(
  defineProps<{
    segments: DonutSegment[]
    size?: number
    thickness?: number
    centerValue?: string
    centerLabel?: string
  }>(),
  { size: 184, thickness: 18, centerValue: '', centerLabel: 'Total' },
)

const uid = useId().replace(/[:,]/g, '')
const mounted = ref(false)
let frame = 0

onMounted(() => {
  frame = requestAnimationFrame(() => {
    mounted.value = true
  })
})

onBeforeUnmount(() => cancelAnimationFrame(frame))

const radius = computed(() => (props.size - props.thickness) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const total = computed(() => props.segments.reduce((sum, segment) => sum + segment.value, 0) || 1)

const geo = computed(() => {
  let cursor = 0
  return props.segments.map((segment) => {
    const portion = segment.value / total.value
    const length = portion * circumference.value
    const item = {
      ...segment,
      length,
      offset: cursor,
      percent: Math.round(portion * 100),
    }
    cursor += length
    return item
  })
})

const ariaLabel = computed(
  () => `Donut chart. ${props.segments.map((segment) => `${segment.label} ${segment.value}%`).join(', ')}.`,
)

const center = computed(() => props.centerValue || `${total.value}%`)
</script>

<template>
  <div class="donut-layout">
    <div class="donut" :style="{ width: `${size}px`, height: `${size}px` }">
      <svg
        :width="size"
        :height="size"
        :viewBox="`0 0 ${size} ${size}`"
        role="img"
        :aria-label="ariaLabel"
      >
        <defs>
          <filter :id="`glow-${uid}`" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          :cx="size / 2"
          :cy="size / 2"
          :r="radius"
          fill="none"
          stroke="var(--grid)"
          :stroke-width="thickness"
        />
        <g :transform="`rotate(-90 ${size / 2} ${size / 2})`" :filter="`url(#glow-${uid})`">
          <circle
            v-for="segment in geo"
            :key="segment.label"
            class="donut-segment"
            :cx="size / 2"
            :cy="size / 2"
            :r="radius"
            fill="none"
            :stroke="segment.color"
            :stroke-width="thickness"
            :stroke-dasharray="`${mounted ? Math.max(segment.length - 3, 0) : 0} ${circumference}`"
            :stroke-dashoffset="-(segment.offset + 1.5)"
            stroke-linecap="round"
          >
            <title>{{ segment.label }} — {{ segment.percent }}%</title>
          </circle>
        </g>
      </svg>
      <div class="donut-center">
        <span class="donut-value nums">{{ center }}</span>
        <span class="donut-label">{{ centerLabel }}</span>
      </div>
    </div>

    <ul class="donut-legend">
      <li v-for="segment in geo" :key="`legend-${segment.label}`">
        <span class="legend-dot" :style="{ background: segment.color }" />
        <span class="legend-label">{{ segment.label }}</span>
        <span class="legend-value nums">{{ segment.percent }}%</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.donut-layout {
  display: flex;
  align-items: center;
  gap: 22px;
  flex-wrap: wrap;
  justify-content: center;
}

.donut {
  position: relative;
  flex: none;
}

.donut svg {
  transform: rotate(0.001deg);
}

.donut-segment {
  transition: stroke-dasharray 1.1s var(--ease);
}

.donut-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  pointer-events: none;
}

.donut-value {
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.05em;
}

.donut-label {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-faint);
}

.donut-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
  min-width: 132px;
  flex: 1;
}

.donut-legend li {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 12px;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex: none;
}

.legend-label {
  color: var(--text-muted);
}

.legend-value {
  margin-left: auto;
  font-size: 11.5px;
  font-weight: 600;
}
</style>
