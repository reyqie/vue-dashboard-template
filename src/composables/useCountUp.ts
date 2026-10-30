import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

export function useCountUp(getTarget: () => number, duration = 1100) {
  const display = ref(0)
  let frame = 0

  const reduceMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function animate(from: number, to: number) {
    cancelAnimationFrame(frame)
    if (reduceMotion() || duration <= 0) {
      display.value = to
      return
    }
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      display.value = from + (to - from) * eased
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
  }

  onMounted(() => animate(0, getTarget()))
  watch(getTarget, (to, from) => animate(from ?? 0, to))
  onBeforeUnmount(() => cancelAnimationFrame(frame))

  return display
}
