// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
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
});