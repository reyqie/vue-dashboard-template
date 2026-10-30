<script setup lang="ts">
import type { Component } from 'vue'
import { AlertTriangle, CheckCircle2, Info, X } from '@lucide/vue'
import { useToast, type ToastTone } from '@/composables/useToast'

const { items, remove } = useToast()

const icons: Record<ToastTone, Component> = {
  success: CheckCircle2,
  info: Info,
  danger: AlertTriangle,
}
</script>

<template>
  <Teleport to="body">
    <div class="toast-host" aria-live="polite" aria-atomic="false">
      <TransitionGroup name="toast">
        <div v-for="item in items" :key="item.id" class="toast" :data-tone="item.tone">
          <span class="toast-icon">
            <component :is="icons[item.tone]" />
          </span>
          <p>{{ item.message }}</p>
          <button type="button" class="toast-close" aria-label="Dismiss notification" @click="remove(item.id)">
            <X />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-host {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 160;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: min(360px, calc(100vw - 32px));
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 12px 13px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-strong);
  background: var(--surface-strong);
  backdrop-filter: blur(20px);
  box-shadow: var(--shadow-lg);
  pointer-events: auto;
}

.toast p {
  flex: 1;
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1.45;
}

.toast-icon {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  flex: none;
  border-radius: 10px;
  background: color-mix(in srgb, var(--success) 14%, transparent);
  color: var(--success);
}

.toast-icon svg {
  width: 16px;
  height: 16px;
}

.toast[data-tone='info'] .toast-icon {
  background: var(--primary-soft);
  color: var(--primary-strong);
}

[data-theme='space'] .toast[data-tone='info'] .toast-icon,
[data-theme='ocean'] .toast[data-tone='info'] .toast-icon {
  color: var(--primary);
}

.toast[data-tone='danger'] .toast-icon {
  background: color-mix(in srgb, var(--danger) 14%, transparent);
  color: var(--danger);
}

.toast-close {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  flex: none;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--text-faint);
}

.toast-close:hover {
  background: color-mix(in srgb, var(--text-faint) 12%, transparent);
  color: var(--text);
}

.toast-close svg {
  width: 14px;
  height: 14px;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.97);
}

.toast-move {
  transition: transform var(--dur) var(--ease);
}
</style>
