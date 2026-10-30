<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import { X } from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    title: string
    description?: string
    width?: string
  }>(),
  { width: '520px' },
)

const emit = defineEmits<{ close: [] }>()

const panel = ref<HTMLElement | null>(null)
const titleId = `modal-title-${useId()}`
let previousFocus: HTMLElement | null = null

function focusableElements(): HTMLElement[] {
  if (!panel.value) return []
  return Array.from(
    panel.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    ),
  )
}

watch(
  () => props.open,
  async (open) => {
    if (open) {
      previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
      document.body.style.overflow = 'hidden'
      await nextTick()
      const first = focusableElements()[0]
      ;(first ?? panel.value)?.focus()
    } else {
      document.body.style.overflow = ''
      previousFocus?.focus()
    }
  },
)

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.stopPropagation()
    emit('close')
    return
  }
  if (event.key !== 'Tab') return
  const items = focusableElements()
  if (!items.length) return
  const first = items[0]
  const last = items[items.length - 1]
  if (!first || !last) return
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-backdrop" @mousedown.self="emit('close')">
        <div
          ref="panel"
          class="modal-panel card"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          tabindex="-1"
          :style="{ maxWidth: width }"
          @keydown="onKeydown"
        >
          <header class="modal-head">
            <div>
              <h2 :id="titleId">{{ title }}</h2>
              <p v-if="description" class="modal-description">{{ description }}</p>
            </div>
            <button type="button" class="icon-btn" aria-label="Close dialog" @click="emit('close')">
              <X />
            </button>
          </header>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 120;
  display: grid;
  place-items: center;
  padding: 20px;
  background: color-mix(in srgb, var(--scene-bottom) 55%, transparent);
  backdrop-filter: blur(6px);
}

.modal-panel {
  width: 100%;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  padding: 22px;
  background: var(--surface-strong);
  animation: modal-rise var(--dur-slow) var(--ease) both;
}

.modal-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

h2 {
  font-size: 19px;
  letter-spacing: -0.02em;
}

.modal-description {
  margin-top: 5px;
  font-size: 12.5px;
  color: var(--text-muted);
}

@keyframes modal-rise {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
