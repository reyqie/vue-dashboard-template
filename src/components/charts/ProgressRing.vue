<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    value: number
    size?: number
    thickness?: number
    label?: string
  }>(),
  { size: 56, thickness: 6, label: 'Progress' },
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
const clamped = computed(() => Math.min(100, Math.max(0, props.value)))
const offset = computed(() =>
  mounted.value ? circumference.value - (clamped.value / 100) * circumference.value : circumference.value,
)
</script>

<template>
  <div
    class="ring"
    :style="{ width: `${size}px`, height: `${size}px` }"
    role="img"
    :aria-label="`${label}: ${Math.round(clamped)} percent`"
  >
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" aria-hidden="true">
      <defs>
        <linearGradient :id="`ring-${uid}`" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="var(--primary)" />
          <stop offset="100%" stop-color="var(--accent)" />
        </linearGradient>
      </defs>
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        stroke="var(--grid)"
        :stroke-width="thickness"
      />
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        :stroke="`url(#ring-${uid})`"
        :stroke-width="thickness"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
        :transform="`rotate(-90 ${size / 2} ${size / 2})`"
        class="ring-progress"
      />
    </svg>
    <span class="ring-value nums">{{ Math.round(clamped) }}<small>%</small></span>
  </div>
</template>

<style scoped>
.ring {
  position: relative;
  flex: none;
  display: grid;
  place-items: center;
}

svg {
  position: absolute;
  inset: 0;
}

.ring-progress {
  transition: stroke-dashoffset 1.1s var(--ease);
}

.ring-value {
  position: relative;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: -0.03em;
}

.ring-value small {
  font-size: 8px;
  color: var(--text-faint);
}
</style>
