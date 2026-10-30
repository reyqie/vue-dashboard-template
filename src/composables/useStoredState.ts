import { ref, watch } from 'vue'

export function useStoredState<T>(
  key: string,
  createDefault: () => T,
  isValid: (value: unknown) => value is T,
) {
  function read(): T {
    if (typeof window === 'undefined') return createDefault()

    try {
      const raw = window.localStorage.getItem(key)
      if (raw === null) return createDefault()

      const value: unknown = JSON.parse(raw)
      if (isValid(value)) return value

      console.warn(`Stored data for "${key}" is invalid. Using the default value.`)
    } catch (error) {
      console.warn(`Could not read stored data for "${key}". Using the default value.`, error)
    }

    return createDefault()
  }

  const state = ref<T>(read())

  if (typeof window !== 'undefined') {
    watch(
      state,
      (value) => {
        try {
          window.localStorage.setItem(key, JSON.stringify(value))
        } catch (error) {
          console.warn(`Could not save stored data for "${key}".`, error)
        }
      },
      { deep: true },
    )
  }

  return state
}
