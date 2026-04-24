export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', {
    getSSRProps() {
      return {}
    },
    mounted(el: HTMLElement) {
      if (!import.meta.client) return

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
      if (reduceMotion.matches) {
        el.classList.add('revealed')
        return
      }

      el.classList.add('will-reveal')
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed')
              obs.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
      )
      observer.observe(el)
    },
  })
})
