import { reactive, watch } from 'vue'

export interface Preferences {
  productUpdates: boolean
  weeklyDigest: boolean
  desktopNotifications: boolean
  reduceMotion: boolean
}

const STORAGE_KEY = 'lumina-preferences'

const defaults: Preferences = {
  productUpdates: true,
  weeklyDigest: true,
  desktopNotifications: false,
  reduceMotion: false,
}

function load(): Preferences {
  if (typeof window === 'undefined') return { ...defaults }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? { ...defaults, ...(JSON.parse(raw) as Partial<Preferences>) } : { ...defaults }
  } catch {
    return { ...defaults }
  }
}

const preferences = reactive<Preferences>(load())

function syncReduceMotion() {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('reduce-motion', preferences.reduceMotion)
}

syncReduceMotion()

watch(
  preferences,
  (value) => {
    syncReduceMotion()
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    } catch {
      /* storage unavailable */
    }
  },
  { deep: true },
)

export function usePreferences() {
  return preferences
}
