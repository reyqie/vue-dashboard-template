<script setup lang="ts">
import { computed, useId } from 'vue'
import { areaPath, getPoints, linePath } from '@/utils/chart'

const props = withDefaults(
  defineProps<{
    data: number[]
    width?: number
    height?: number
    color?: string
  }>(),
  { width: 120, height: 38, color: 'var(--chart-1)' },
)

const uid = useId().replace(/[:,]/g, '')
const points = computed(() => getPoints(props.data, props.width, props.height, 3))
const line = computed(() => linePath(points.value))
const area = computed(() => areaPath(points.value, props.height))
</script>

<template>
  <svg class="spark" :viewBox="`0 0 ${width} ${height}`" aria-hidden="true">
    <defs>
      <linearGradient :id="`spark-${uid}`" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" :stop-color="color" stop-opacity="0.32" />
        <stop offset="100%" :stop-color="color" stop-opacity="0" />
      </linearGradient>
    </defs>
    <path :d="area" :fill="`url(#spark-${uid})`" />
    <path
      class="spark-line"
      :d="line"
      :stroke="color"
      fill="none"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      vector-effect="non-scaling-stroke"
    />
  </svg>
</template>

<style scoped>
.spark {
  width: 100%;
  height: auto;
  overflow: visible;
}

.spark-line {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: draw-spark 1.3s var(--ease) 0.15s forwards;
}

@keyframes draw-spark {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
