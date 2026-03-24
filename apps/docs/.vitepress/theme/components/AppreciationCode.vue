<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

const { isDark } = useData()

const props = defineProps<{ accountType: '赞赏码' | '公众号'; tier: string }>()

const imgSrc = computed(() =>
  props.accountType === '赞赏码'
    ? isDark.value
      ? `/jike/appreciation/AppreciationCode-dark.jpg`
      : `/jike/appreciation/AppreciationCode-light.jpg`
    : isDark.value
      ? `/jike/official-qr-dark.png`
      : `/jike/official-qr-light.png`,
)
</script>

<template>
  <section class="mt-4">
    <h3
      v-if="tier"
      class="vp-sponsor-tier py-1 rounded-tl-lg rounded-tr-lg">
      {{ tier }}
    </h3>
    <img
      :src="imgSrc"
      alt="赞赏码"
      class="rounded-md mt-1" />
  </section>
</template>
