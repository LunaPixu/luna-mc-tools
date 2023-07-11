<script setup lang="ts">
import routeData from "./content/routeData.json";

const route = useRoute();
const routeList = routeData.routes;

useHeadSafe({
  htmlAttrs: {
    lang: 'en',
  },
  templateParams: {
    site: {
      name: "Luna's Minecraft Tools",
      url: "https://luna-minecraft-tools.vercel.app",
      description: "A collection of miscellaneous Minecraft tools for various Minecraft needs.",
    },
    separator: "/"
  },
  titleTemplate: `%s %separator %site.name`,
  link: [
    {
      rel: "apple-touch-icon",
      href: "/apple-touch-icon-180x180.png",
    },
    {
      rel: "icon",
      href: "/favicon.ico",
      sizes: "any",
    },
    {
      rel: "icon",
      href: "/favicon.svg",
      type: "image/svg+xml"
    },
  ],
});
useSeoMeta({
  description: "%site.description",
  ogTitle: "%site.name",
  ogDescription: "%site.description",
  ogUrl: "%site.url",
  ogType: "website",
  ogImage: "%site.url/lunapixu.png",
  themeColor: "#3366ff",
});
</script>

<template>
  <VitePwaManifest />
  <NuxtLoadingIndicator />
  <div id="title" class="box">
    <div style="position: relative">
      <img id="lunapixu" src="/lunapixu.png" alt="Luna Pixu's icon" height="64px" width="64px"/>
      <span id="social">
        <a href="https://twitter.com/luna_pixu" target="_blank" aria-label="Luna Pixu's Twitter"><font-awesome-icon icon="fa-brands fa-twitter"
            class="icon" /></a>
        <a href="https://github.com/lunapixu/" target="_blank" aria-label="Luna Pixu's Github"><font-awesome-icon icon="fa-brands fa-github"
            class="icon" /></a>
      </span>
    </div>
    <h1 style="margin: 0.2em 0">Luna's Minecraft Tools</h1>
    <p style="margin: 0.2em 0">
      <i>Miscellaneous Tools for Miscellaneous Minecraft Needs</i>
    </p>
  </div>
  <ClientOnly>
    <Navigation />
  </ClientOnly>
  <div id="page">
    <NuxtPage />
  </div>
</template>

<style scoped>
.icon {
  height: 40px;
  margin-left: 0.5em;
  color: #ffffff;
}
#title {
  transition: width 0.5s, margin 0.5s;

  margin-left: calc(var(--sidebar-width) + 16px);
  margin-right: 0px;
  margin-top: 0px;
  padding: 1em 2em;
  /** 80px comes from the padding of the sidebar and title. (8+8+32+32) */
  width: calc(100vw - var(--sidebar-width) - 80px);
  border-radius: 0px;
}
#social {
  text-align: right;
  position: absolute;
  inset-inline: 65% 0;
}
#lunapixu {
  box-shadow: 0px 0px 5px black;
}

#page {
  transition: width 0.5s, margin 0.5s;

  margin-left: calc(var(--sidebar-width) + 16px);
  /** 80px comes from the padding of the sidebar and page content. (8+8+32+32) */
  width: calc(100vw - var(--sidebar-width) - 80px);
  padding: 0 2rem;
}

@media only screen and (max-width: 750px) {
  #title {
    margin: 0 auto;
    margin-bottom: 0.5em;
    padding: 1em;
    padding-bottom: 0.5em;
    width: auto;
    max-width: 800px;
    border-radius: 10px;
  }

  #page {
    margin-left: 0;
    width: auto;
    padding: 0;
  }
}
</style>
