<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { CornerDownLeft, Search } from '@lucide/vue'
import { flatNav } from '@/composables/useNav'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const router = useRouter()
const query = ref('')
const activeIndex = ref(0)
const inputEl = ref<HTMLInputElement | null>(null)

const results = computed(() => {
  const term = query.value.trim().toLowerCase()
  if (!term) return flatNav
  return flatNav.filter((item) => item.label.toLowerCase().includes(term) || item.to.includes(term))
})

watch(
  () => props.open,
  async (open) => {
    if (!open) return
    query.value = ''
    activeIndex.value = 0
    await nextTick()
    inputEl.value?.focus()
  },
)

watch(query, () => {
  activeIndex.value = 0
})

function choose(index = activeIndex.value) {
  const item = results.value[index]
  if (!item) return
  router.push(item.to)
  emit('close')
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close')
    return
  }
  if (!results.value.length) return
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % results.value.length
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    activeIndex.value = (activeIndex.value - 1 + results.value.length) % results.value.length
  } else if (event.key === 'Enter') {
    event.preventDefault()
    choose()
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="palette">
      <div v-if="open" class="palette-backdrop" @mousedown.self="emit('close')">
        <div class="palette" role="dialog" aria-modal="true" aria-label="Command palette" @keydown="onKeydown">
          <div class="palette-search">
            <Search aria-hidden="true" />
            <input
              ref="inputEl"
              v-model="query"
              type="text"
              placeholder="Search pages and sections…"
              aria-label="Search pages"
              autocomplete="off"
              spellcheck="false"
            />
            <kbd>Esc</kbd>
          </div>

          <p class="palette-hint">Navigate</p>
          <ul v-if="results.length" class="palette-list" role="listbox" aria-label="Pages">
            <li v-for="(item, index) in results" :key="item.to">
              <button
                type="button"
                role="option"
                :aria-selected="index === activeIndex"
                class="palette-item"
                :class="{ active: index === activeIndex }"
                @mouseenter="activeIndex = index"
                @click="choose(index)"
              >
                <span class="palette-icon"><component :is="item.icon" /></span>
                <span class="palette-label">{{ item.label }}</span>
                <span class="palette-path">{{ item.to }}</span>
                <CornerDownLeft v-if="index === activeIndex" class="palette-enter" />
              </button>
            </li>
          </ul>
          <p v-else class="palette-empty">No pages match “{{ query }}”.</p>

          <footer class="palette-footer">
            <span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span>
            <span><kbd>↵</kbd> to open</span>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.palette-backdrop {
  position: fixed;
  inset: 0;
  z-index: 130;
  display: flex;
  justify-content: center;
  padding: 12vh 20px 20px;
  background: color-mix(in srgb, var(--scene-bottom) 45%, transparent);
  backdrop-filter: blur(8px);
}

.palette {
  width: min(560px, 100%);
  height: fit-content;
  max-height: 70vh;
  overflow: hidden;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-strong);
  background: var(--surface-strong);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(24px);
  animation: palette-in var(--dur) var(--ease) both;
}

@keyframes palette-in {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.985);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.palette-search {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
}

.palette-search svg {
  width: 18px;
  height: 18px;
  color: var(--text-faint);
  flex: none;
}

.palette-search input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  outline: none;
  font-size: 14px;
  padding: 4px 0;
}

.palette-search input::placeholder {
  color: var(--text-faint);
}

.palette-search kbd,
.palette-footer kbd {
  display: inline-grid;
  place-items: center;
  min-width: 22px;
  height: 20px;
  padding: 0 5px;
  border-radius: 6px;
  border: 1px solid var(--border-strong);
  background: color-mix(in srgb, var(--text-faint) 10%, transparent);
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-muted);
}

.palette-hint {
  padding: 12px 18px 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-faint);
}

.palette-list {
  list-style: none;
  margin: 0;
  padding: 4px 8px 8px;
  max-height: 44vh;
  overflow-y: auto;
}

.palette-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 9px 10px;
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  text-align: left;
  transition: background-color var(--dur-fast) var(--ease);
}

.palette-item.active,
.palette-item:hover {
  background: var(--primary-soft);
}

.palette-icon {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  flex: none;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
}

.palette-icon svg {
  width: 16px;
  height: 16px;
}

.palette-item.active .palette-icon {
  color: var(--primary);
  border-color: color-mix(in srgb, var(--primary) 30%, transparent);
}

.palette-label {
  font-size: 13px;
  font-weight: 600;
}

.palette-path {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--text-faint);
}

.palette-enter {
  width: 14px;
  height: 14px;
  color: var(--primary);
  flex: none;
}

.palette-empty {
  padding: 22px 18px;
  font-size: 12.5px;
  color: var(--text-muted);
}

.palette-footer {
  display: flex;
  gap: 18px;
  padding: 10px 16px;
  border-top: 1px solid var(--border);
  font-size: 10.5px;
  color: var(--text-faint);
}

.palette-footer span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.palette-enter-active,
.palette-leave-active {
  transition: opacity var(--dur) var(--ease);
}

.palette-enter-from,
.palette-leave-to {
  opacity: 0;
}
</style>
