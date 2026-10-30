<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  description?: string
}>()
</script>

<template>
  <header class="page-head">
    <div class="page-head-copy">
      <p class="eyebrow">{{ eyebrow }}</p>
      <h1>{{ title }}</h1>
      <p v-if="description" class="page-sub">{{ description }}</p>
    </div>
    <div class="page-actions">
      <slot />
    </div>
  </header>
</template>

<style scoped>
.page-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 24px;
  animation: rise var(--dur-slow) var(--ease) both;
}

h1 {
  margin-top: 8px;
  font-size: clamp(26px, 3vw, 34px);
  font-weight: 700;
  letter-spacing: -0.035em;
}

.page-sub {
  margin-top: 7px;
  max-width: 56ch;
  font-size: 13.5px;
  color: var(--text-muted);
}

.page-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
</style>
