<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    values: number[][]
    dayLabels: string[]
    hourLabels: string[]
    label?: string
  }>(),
  { label: 'Engagement heatmap' },
)

const columns = computed(() => props.values[0]?.length ?? 1)
const average = computed(() => {
  const all = props.values.flat()
  return all.length ? Math.round(all.reduce((sum, value) => sum + value, 0) / all.length) : 0
})
const peak = computed(() => Math.max(1, ...props.values.flat()))

const ariaLabel = computed(
  () => `${props.label}. ${props.dayLabels.length} days by ${columns.value} time slots. Average intensity ${average.value} of 100.`,
)

function opacity(value: number) {
  return 0.08 + (value / peak.value) * 0.88
}

function cellTitle(day: number, hour: number) {
  const dayLabel = props.dayLabels[day] ?? ''
  const slot = props.hourLabels[Math.floor((hour / Math.max(1, columns.value)) * props.hourLabels.length)] ?? ''
  return `${dayLabel} ${slot} — ${props.values[day]?.[hour] ?? 0} sessions`
}
</script>

<template>
  <figure class="heat" role="img" :aria-label="ariaLabel">
    <div class="heat-main">
      <div class="heat-days" aria-hidden="true">
        <span v-for="day in dayLabels" :key="day">{{ day }}</span>
      </div>
      <div
        class="heat-grid"
        :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }"
        aria-hidden="true"
      >
        <template v-for="(row, dayIndex) in values" :key="`row-${dayIndex}`">
          <span
            v-for="(value, hourIndex) in row"
            :key="`cell-${dayIndex}-${hourIndex}`"
            class="heat-cell"
            :style="{ opacity: opacity(value) }"
            :title="cellTitle(dayIndex, hourIndex)"
          />
        </template>
      </div>
    </div>

    <div class="heat-axis" aria-hidden="true">
      <span v-for="hour in hourLabels" :key="hour">{{ hour }}</span>
    </div>

    <figcaption class="heat-legend">
      <span class="heat-average">Average <strong class="nums">{{ average }}</strong> sessions</span>
      <span class="heat-scale" aria-hidden="true">
        Less
        <i v-for="step in 5" :key="step" :style="{ opacity: 0.15 + (step - 1) * 0.2 }" />
        More
      </span>
    </figcaption>
  </figure>
</template>

<style scoped>
.heat {
  margin: 0;
}

.heat-main {
  display: flex;
  gap: 8px;
}

.heat-days {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1px 0;
  font-size: 9.5px;
  font-weight: 600;
  color: var(--text-faint);
}

.heat-grid {
  display: grid;
  gap: 4px;
  flex: 1;
}

.heat-cell {
  aspect-ratio: 1;
  min-width: 6px;
  border-radius: 4px;
  background: var(--primary);
  transition: opacity var(--dur) var(--ease), transform var(--dur-fast) var(--ease);
}

.heat-cell:hover {
  transform: scale(1.18);
  opacity: 1 !important;
}

.heat-axis {
  display: flex;
  justify-content: space-between;
  margin: 8px 0 0 32px;
  font-size: 9.5px;
  color: var(--text-faint);
  font-family: var(--font-mono);
}

.heat-legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 14px;
  font-size: 10.5px;
  color: var(--text-faint);
}

.heat-average strong {
  color: var(--text-muted);
  font-weight: 600;
}

.heat-scale {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.heat-scale i {
  width: 9px;
  height: 9px;
  border-radius: 3px;
  background: var(--primary);
}
</style>
