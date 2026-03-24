<script setup lang="ts">
import { useData } from 'vitepress'
import DefaultTheme, { VPDocAsideSponsors } from 'vitepress/theme'
import { onMounted, onUnmounted, provide, ref } from 'vue'
import { useToggleTheme } from '../composables/toggleTheme'
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
      <VPDocAsideSponsors
        :data="[
          {
            name: 'VueMastery',
            img: 'https://sponsors.vuejs.org/images/vuemastery.avif',
            url: 'https://www.vuemastery.com/',
          },
          {
            name: 'VueSchool',
            img: 'https://sponsors.vuejs.org/images/vueschool.avif',
            url: 'https://vueschool.io/?utm_source=Vuejs.org&utm_medium=Banner&utm_campaign=Sponsored%20Banner&utm_content=V1',
          },
          {
            name: 'Vehikl',
            img: 'https://sponsors.vuejs.org/images/vehikl.avif',
            url: 'https://vehikl.com/',
          },
          {
            name: 'Passionate People',
            img: 'https://sponsors.vuejs.org/images/passionate_people.avif',
            url: 'https://passionatepeople.io/',
          },
        ]"
        :size="'xmini'"
        :mode="'aside'"
        :tier="'赞助商'"
        style="margin-bottom: 1rem" />
    </template>

    <template #aside-ads-after>
      <VPDocAsideSponsors
        :data="[
          {
            name: 'Vehikl',
            img: 'https://sponsors.vuejs.org/images/vehikl.avif',
            url: 'https://vehikl.com/',
          },
          {
            name: 'Passionate People',
            img: 'https://sponsors.vuejs.org/images/passionate_people.avif',
            url: 'https://passionatepeople.io/',
          },
        ]"
        :size="'mini'"
        :mode="'normal'" />
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
