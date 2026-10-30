import { computed, readonly, ref } from 'vue'

export type ThemeId = 'sakura' | 'space' | 'ocean'

export interface ThemeMeta {
  id: ThemeId
  label: string
  description: string
  swatch: string
  color: string
}

export const themes: ThemeMeta[] = [
  {
    id: 'sakura',
    label: 'Sakura',
    description: 'Soft blush, warm light and quiet luxury.',
    swatch: 'linear-gradient(135deg, #ffb7ce 0%, #c4b5fd 58%, #ffe4c4 100%)',
    color: '#fbf5f7',
  },
  {
    id: 'space',
    label: 'Space',
    description: 'Deep cosmos, violet nebulas and luminous data.',
    swatch: 'linear-gradient(135deg, #7c5cff 0%, #22d3ee 56%, #f472b6 100%)',
    color: '#060a18',
  },
  {
    id: 'ocean',
    label: 'Ocean',
    description: 'Abyssal teal with bioluminescent accents.',
    swatch: 'linear-gradient(135deg, #2fd4c4 0%, #4f9df7 58%, #8ee7f0 100%)',
    color: '#04161c',
  },
]

const STORAGE_KEY = 'lumina-theme'
const validThemes = themes.map((theme) => theme.id)

function readTheme(): ThemeId {
  if (typeof window === 'undefined') return 'sakura'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeId | null
    return stored && validThemes.includes(stored) ? stored : 'sakura'
  } catch {
    return 'sakura'
  }
}

const current = ref<ThemeId>(readTheme())

function apply(id: ThemeId) {
  current.value = id
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = id
  const meta = themes.find((theme) => theme.id === id)
  const tag = document.querySelector('meta[name="theme-color"]')
  if (meta && tag) tag.setAttribute('content', meta.color)
}

export function initTheme() {
  apply(readTheme())
  try {
    window.localStorage.setItem(STORAGE_KEY, current.value)
  } catch {
    /* storage unavailable */
  }
}

export function setTheme(id: ThemeId) {
  apply(id)
  try {
    window.localStorage.setItem(STORAGE_KEY, id)
  } catch {
    /* storage unavailable */
  }
}

export function useTheme() {
  return {
    theme: readonly(current),
    currentTheme: computed(() => themes.find((theme) => theme.id === current.value) ?? themes[0]),
    themes,
    setTheme,
  }
}
