<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

withDefaults(defineProps<{ labels?: boolean }>(), { labels: false })

const { theme, themes, setTheme } = useTheme()
</script>

<template>
  <div class="switcher" role="radiogroup" aria-label="Color theme">
    <button
      v-for="item in themes"
      :key="item.id"
      type="button"
      class="switcher-btn"
      :class="{ active: theme === item.id }"
      role="radio"
      :aria-checked="theme === item.id"
      :aria-label="`${item.label} theme`"
      :title="`${item.label} — ${item.description}`"
      @click="setTheme(item.id)"
    >
      <span class="swatch" :style="{ background: item.swatch }" />
      <span v-if="labels" class="switcher-label">{{ item.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.switcher {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface);
  backdrop-filter: blur(14px);
}

.switcher-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 30px;
  min-width: 30px;
  padding: 0 6px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  transition: background-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}

.switcher-btn:hover {
  background: color-mix(in srgb, var(--text-faint) 12%, transparent);
}

.switcher-btn.active {
  background: var(--surface-strong);
  box-shadow: var(--shadow-xs);
}

.swatch {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  flex: none;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35);
  transition: transform var(--dur) var(--ease-spring);
}

.switcher-btn:hover .swatch {
  transform: scale(1.12);
}

.switcher-btn.active .swatch {
  box-shadow: 0 0 0 2px var(--surface-strong), 0 0 0 3.5px color-mix(in srgb, var(--primary) 60%, transparent);
}

.switcher-label {
  padding-right: 6px;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--text-muted);
}

.switcher-btn.active .switcher-label {
  color: var(--text);
}
</style>
