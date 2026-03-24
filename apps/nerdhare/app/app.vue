<script setup>
useHead({
  meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "en",
  },
});

const title = "极客兔 - 用心做好每件事";
const description =
  "极客兔，用心做好每件事。专注于为客户提供优质的产品和服务，提供一流的技术支持，打造极致的用户体验。";

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
});
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink to="/" class="flex justify-center items-center gap-2">
          <AppLogo class="inline-block w-auto h-6 shrink-0" />
          <span
            class="inline-block font-bold bg-linear-to-r from-green-500 to-cyan-600 bg-clip-text text-transparent"
            >极客兔</span
          >
        </NuxtLink>
      </template>

      <template #right>
        <!-- <UColorModeButton /> -->

        <!-- 全局调色面板 -->
        <ThemeColorPicker />

        <UButton
          to="https://github.com/nuxt-ui-templates/starter"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator icon="i-simple-icons-nuxtdotjs" />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Built with Nuxt UI and Element Plus • © {{ new Date().getFullYear() }}
        </p>
      </template>

      <template #right>
        <UButton
          to="https://github.com/nuxt-ui-templates/starter"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UFooter>
  </UApp>
</template>
