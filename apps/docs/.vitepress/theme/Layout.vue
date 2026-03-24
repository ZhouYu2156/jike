<script setup lang="ts">
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { onMounted, onUnmounted, provide, ref } from 'vue'
import { useToggleTheme } from '../composables/toggleTheme'
import AppreciationCode from './components/AppreciationCode.vue'
import MusicPlayer from './components/MusicPlayer.vue'
import ThemeSelector from './components/ThemeSelector.vue'

const { Layout } = DefaultTheme
const { isDark } = useData()

const enableTransitions = () =>
  'startViewTransition' in document && window.matchMedia('(prefers-reduced-motion: no-preference)').matches

const showMobileThemeSelector = ref(false)

const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  showMobileThemeSelector.value = scrollTop > 300
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value
    return
  }
  const transition = true // 开启渐变过渡

  if (transition) {
    // 渐熄模式
    document.startViewTransition(async () => {
      isDark.value = !isDark.value
    })
  } else {
    useToggleTheme({ x, y, isDark })
  }
})
</script>

<template>
  <Layout>
    <template #nav-bar-content-after>
      <ThemeSelector />
      <MusicPlayer />
    </template>

    <template #aside-ads-before>
      <AppreciationCode
        account-type="公众号"
        tier="公众号" />
    </template>
    <template #aside-ads-after>
      <AppreciationCode
        account-type="赞赏码"
        tier="赞赏码" />
    </template>
  </Layout>
</template>

<style>
/*::view-transition-new(root),
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
}*/
</style>
