import { nextTick, Ref } from 'vue'

export async function useToggleTheme({ x, y, isDark }: { x: number; y: number; isDark: Ref<boolean> }) {
  const style = document.createElement('style')
  style.textContent = `
    ::view-transition-new(root),
    ::view-transition-old(root) {
      animation: none;
      mix-blend-mode: normal;
    }

    ::view-transition-old(root),
    .dark::view-transition-new(root) {
      z-index: 1;
    }

    ::view-transition-new(root),
    .dark::view-transition-old(root) {
      z-index: 9999;
    }
    `
  document.body.appendChild(style)

  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

  const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]

  await document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  }).ready

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 500,
      easing: 'ease-in-out',
      fill: 'both',
      pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`,
    },
  )
}
