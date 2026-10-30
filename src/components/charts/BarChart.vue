<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { BarItem } from '@/types'
import { compact } from '@/utils/chart'

const props = withDefaults(
  defineProps<{
    items: BarItem[]
    unit?: string
    decimals?: number
  }>(),
  { unit: '', decimals: 0 },
)

const mounted = ref(false)
onMounted(() => {
  requestAnimationFrame(() => {
    mounted.value = true
  })
})

const max = computed(() => Math.max(1, ...props.items.map((item) => item.value)))

function percent(value: number) {
  return Math.max(4, (value / max.value) * 100)
}

function format(value: number) {
  if (props.decimals > 0) return value.toFixed(props.decimals)
  return compact(value)
}
</script>

<template>
  <ul class="bars">
    <li
      v-for="(item, index) in items"
      :key="item.label"
      class="bar-row"
      :style="{ transitionDelay: `${index * 70}ms` }"
    >
      <div class="bar-meta">
        <span class="bar-label">{{ item.label }}</span>
        <span class="bar-value nums">{{ format(item.value) }}{{ unit }}</span>
      </div>
      <div class="bar-track">
        <span
          class="bar-fill"
          :style="{
            width: mounted ? `${percent(item.value)}%` : '0%',
            background: item.color ?? 'var(--primary)',
            transitionDelay: `${index * 70}ms`,
          }"
        />
      </div>
    </li>
  </ul>
</template>

<style scoped>
.bars {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.bar-meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 7px;
}

.bar-label {
  font-size: 12.5px;
  font-weight: 600;
}

.bar-value {
  font-size: 11.5px;
  color: var(--text-muted);
}

.bar-track {
  height: 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--text-faint) 13%, transparent);
  overflow: hidden;
}

.bar-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  transition: width 1s var(--ease);
  box-shadow: 0 0 16px -2px color-mix(in srgb, var(--primary) 45%, transparent);
}
</style>
