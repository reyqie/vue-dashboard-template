import { ref } from 'vue'

export type ToastTone = 'success' | 'info' | 'danger'

export interface ToastItem {
  id: number
  message: string
  tone: ToastTone
}

const items = ref<ToastItem[]>([])
let counter = 0

export function useToast() {
  function remove(id: number) {
    items.value = items.value.filter((item) => item.id !== id)
  }

  function toast(message: string, tone: ToastTone = 'success') {
    const id = ++counter
    items.value = [...items.value, { id, message, tone }]
    window.setTimeout(() => remove(id), 3400)
  }

  return { items, toast, remove }
}
