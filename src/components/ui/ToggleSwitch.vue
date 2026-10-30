<script setup lang="ts">
defineProps<{
  modelValue: boolean
  label: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<template>
  <button
    type="button"
    class="toggle"
    role="switch"
    :aria-checked="modelValue"
    :aria-label="label"
    @click="emit('update:modelValue', !modelValue)"
  >
    <span class="toggle-track">
      <span class="toggle-thumb" />
    </span>
  </button>
</template>

<style scoped>
.toggle {
  display: inline-flex;
  flex: none;
  padding: 0;
  border: 0;
  background: transparent;
  border-radius: 999px;
}

.toggle-track {
  position: relative;
  display: block;
  width: 42px;
  height: 24px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--text-faint) 26%, transparent);
  border: 1px solid var(--border);
  transition: background-color var(--dur) var(--ease), border-color var(--dur) var(--ease);
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--surface-solid);
  box-shadow: var(--shadow-sm);
  transition: transform var(--dur) var(--ease-spring), background-color var(--dur) var(--ease);
}

.toggle[aria-checked='true'] .toggle-track {
  background: linear-gradient(135deg, var(--primary), var(--primary-strong));
  border-color: transparent;
}

.toggle[aria-checked='true'] .toggle-thumb {
  transform: translateX(18px);
  background: var(--on-primary);
}
</style>
