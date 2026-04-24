export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (reduceMotion.matches) return

  let targetX = 20
  let targetY = 15
  let currentX = targetX
  let currentY = targetY
  let rafId = 0

  const tick = () => {
    currentX += (targetX - currentX) * 0.08
    currentY += (targetY - currentY) * 0.08
    document.documentElement.style.setProperty('--mouse-x', `${currentX}%`)
    document.documentElement.style.setProperty('--mouse-y', `${currentY}%`)

    if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
      rafId = requestAnimationFrame(tick)
    } else {
      rafId = 0
    }
  }

  const onMove = (e: PointerEvent) => {
    targetX = (e.clientX / window.innerWidth) * 100
    targetY = (e.clientY / window.innerHeight) * 100
    if (!rafId) rafId = requestAnimationFrame(tick)
  }

  window.addEventListener('pointermove', onMove, { passive: true })
})
