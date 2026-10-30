<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, type CSSProperties } from 'vue'
import { useId } from 'vue'
import type { Series } from '@/types'
import { areaPath, compact, linePath, niceMax } from '@/utils/chart'

const props = withDefaults(
  defineProps<{
    labels: string[]
    series: Series[]
    height?: number
    prefix?: string
    suffix?: string
  }>(),
  { height: 260, prefix: '', suffix: '' },
)

const uid = useId().replace(/[:,]/g, '')
const chartHost = ref<HTMLElement | null>(null)
const width = ref(640)
let observer: ResizeObserver | null = null

const padL = 48
const padR = 12
const padT = 14
const padB = 30

onMounted(() => {
  const el = chartHost.value
  if (!el) return
  width.value = Math.max(280, Math.round(el.clientWidth))
  observer = new ResizeObserver((entries) => {
    const next = entries[0]?.contentRect.width ?? width.value
    width.value = Math.max(280, Math.round(next))
  })
  observer.observe(el)
})

onBeforeUnmount(() => observer?.disconnect())

const plotW = computed(() => Math.max(20, width.value - padL - padR))
const plotH = computed(() => Math.max(20, props.height - padT - padB))
const maxValue = computed(() => niceMax(Math.max(1, ...props.series.flatMap((item) => item.data))))

const geo = computed(() =>
  props.series.map((item) => {
    const lastIndex = Math.max(1, item.data.length - 1)
    const points = item.data.map((value, index) => ({
      x: padL + (index / lastIndex) * plotW.value,
      y: padT + plotH.value - (value / maxValue.value) * plotH.value,
    }))
    return {
      ...item,
      points,
      line: linePath(points),
      area: areaPath(points, padT + plotH.value),
    }
  }),
)

const grid = computed(() =>
  [0, 0.25, 0.5, 0.75, 1].map((tick) => ({
    y: padT + plotH.value * (1 - tick),
    value: maxValue.value * tick,
  })),
)

const labelStep = computed(() => Math.max(1, Math.ceil(props.labels.length / 6)))
const active = ref(-1)

const activeX = computed(() => {
  if (active.value < 0) return padL
  return padL + (active.value / Math.max(1, props.labels.length - 1)) * plotW.value
})

const tooltipStyle = computed<CSSProperties>(() => {
  const percent = width.value ? (activeX.value / width.value) * 100 : 50
  return { left: `${Math.min(88, Math.max(12, percent))}%` }
})

function formatValue(value: number) {
  return `${props.prefix}${compact(value)}${props.suffix}`
}

const ariaLabel = computed(() => {
  const parts = props.series.map((item) => {
    const first = item.data[0] ?? 0
    const last = item.data[item.data.length - 1] ?? 0
    return `${item.name} from ${formatValue(first)} to ${formatValue(last)}`
  })
  return `Line chart. ${parts.join('. ')}. Use the left and right arrow keys to inspect data points.`
})

function onPointerMove(event: PointerEvent) {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const ratio = (event.clientX - rect.left - padL) / plotW.value
  const index = Math.round(ratio * (props.labels.length - 1))
  active.value = Math.min(props.labels.length - 1, Math.max(0, index))
}

function step(direction: number) {
  if (active.value < 0) {
    active.value = direction > 0 ? 0 : props.labels.length - 1
    return
  }
  active.value = Math.min(props.labels.length - 1, Math.max(0, active.value + direction))
}

function focusChart() {
  if (active.value < 0) active.value = props.labels.length - 1
}
</script>

<template>
  <div class="chart">
    <div class="chart-legend">
      <span v-for="item in series" :key="item.name" class="legend-item">
        <i :style="{ background: item.color }" />
        {{ item.name }}
      </span>
    </div>

    <div
      ref="chartHost"
      class="chart-host"
      tabindex="0"
      role="img"
      :aria-label="ariaLabel"
      @pointermove="onPointerMove"
      @pointerleave="active = -1"
      @keydown.left.prevent="step(-1)"
      @keydown.right.prevent="step(1)"
      @keydown.esc="active = -1"
      @focus="focusChart"
    >
      <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`" aria-hidden="true">
        <defs>
          <linearGradient
            v-for="(item, index) in series"
            :id="`chart-grad-${uid}-${index}`"
            :key="`grad-${item.name}`"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" :stop-color="item.color" stop-opacity="0.26" />
            <stop offset="100%" :stop-color="item.color" stop-opacity="0" />
          </linearGradient>
        </defs>

        <g>
          <line
            v-for="row in grid"
            :key="`grid-${row.y}`"
            class="grid-line"
            :x1="padL"
            :x2="width - padR"
            :y1="row.y"
            :y2="row.y"
          />
          <text
            v-for="row in grid"
            :key="`label-${row.y}`"
            class="axis-label"
            :x="padL - 10"
            :y="row.y + 4"
            text-anchor="end"
          >
            {{ formatValue(row.value) }}
          </text>
        </g>

        <g>
          <path
            v-for="(item, index) in geo"
            :key="`area-${item.name}-${item.data.join('-')}`"
            class="chart-area"
            :d="item.area"
            :fill="`url(#chart-grad-${uid}-${index})`"
          />
        </g>

        <g>
          <path
            v-for="item in geo"
            :key="`line-${item.name}-${item.data.join('-')}`"
            class="chart-line"
            :d="item.line"
            :stroke="item.color"
            fill="none"
            stroke-width="2.4"
            stroke-linecap="round"
            stroke-linejoin="round"
            pathLength="1"
          />
        </g>

        <g v-if="active >= 0">
          <line class="guide" :x1="activeX" :x2="activeX" :y1="padT" :y2="padT + plotH" />
          <circle
            v-for="item in geo"
            :key="`dot-${item.name}`"
            :cx="item.points[active]?.x"
            :cy="item.points[active]?.y"
            r="4"
            :fill="item.color"
            stroke="var(--surface-solid)"
            stroke-width="2"
          />
        </g>

        <g>
          <template v-for="(label, index) in labels" :key="`x-${label}-${index}`">
            <text
              v-if="index % labelStep === 0 || index === labels.length - 1"
              class="axis-label"
              :x="padL + (index / Math.max(1, labels.length - 1)) * plotW"
              :y="height - 8"
              text-anchor="middle"
            >
              {{ label }}
            </text>
          </template>
        </g>
      </svg>

      <div v-if="active >= 0" class="chart-tooltip" :style="tooltipStyle" aria-hidden="true">
        <p class="tip-label">{{ labels[active] }}</p>
        <p v-for="item in series" :key="`tip-${item.name}`" class="tip-row">
          <i :style="{ background: item.color }" />
          <span>{{ item.name }}</span>
          <strong class="nums">{{ formatValue(item.data[active] ?? 0) }}</strong>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--text-muted);
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.legend-item i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  box-shadow: 0 0 0 3px color-mix(in srgb, currentColor 8%, transparent);
}

.chart-host {
  position: relative;
  width: 100%;
  border-radius: var(--radius-md);
  touch-action: pan-y;
  cursor: crosshair;
}

.chart-host:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 4px;
}

svg {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}

.grid-line {
  stroke: var(--grid);
  stroke-width: 1;
  stroke-dasharray: 3 6;
}

.axis-label {
  fill: var(--text-faint);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: -0.02em;
}

.guide {
  stroke: color-mix(in srgb, var(--text-faint) 55%, transparent);
  stroke-width: 1;
  stroke-dasharray: 4 4;
}

.chart-line {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: draw-line 1.5s var(--ease) 0.1s forwards;
}

.chart-area {
  opacity: 0;
  animation: fade-in 1.1s var(--ease) 0.25s forwards;
}

@keyframes draw-line {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes fade-in {
  to {
    opacity: 1;
  }
}

.chart-tooltip {
  position: absolute;
  top: 6px;
  z-index: 2;
  min-width: 138px;
  padding: 9px 12px;
  transform: translateX(-50%);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-strong);
  background: var(--surface-strong);
  box-shadow: var(--shadow);
  backdrop-filter: blur(16px);
  pointer-events: none;
  transition: left 80ms linear;
}

.tip-label {
  margin-bottom: 5px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.tip-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 0;
  font-size: 11.5px;
  color: var(--text-muted);
}

.tip-row i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.tip-row strong {
  margin-left: auto;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--text);
}
</style>
