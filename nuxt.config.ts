// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    "@vite-pwa/nuxt",
  ],
  build: {
    transpile: [
      '@fortawesome/vue-fontawesome',
      '@fortawesome/fontawesome-svg-core',
      '@fortawesome/pro-solid-svg-icons',
      '@fortawesome/pro-regular-svg-icons',
      '@fortawesome/free-brands-svg-icons',
    ],
  },
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
    '/assets/css/style.css',
  ],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: "Luna's Minecraft Tools",
      short_name: "LMT",
      description: "A collection of miscellaneous Minecraft tools for various Minecraft needs.",
      background_color: "#fff",
      theme_color: "#3366ff",
      lang: "en-US",
      display: "standalone",
      orientation: "any",
    },
    client: {
      installPrompt: true,
    }
  },
});