<script setup lang="ts">
import navigation from './components/navigation.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import routeData from "./content/routeData.json";

const route = useRoute();
const routeList = routeData.routes;
const siteName = "Luna's Minecraft Tools";

useHeadSafe({
  htmlAttrs: {
    lang: 'en',
  },
  templateParams: {
    site: {
      name: siteName,
      url: "https://luna-minecraft-tools.vercel.app",
      description: "A collection of miscellaneous Minecraft tools for various Minecraft needs.",
    },
    seperator: "/"
  },
  titleTemplate: (title?: string) => title ? `${title} / ${siteName}` : `${siteName}`,
  title: () => {
    const page = routeList.find(el => el.slug === route.name);
    if (!page) return "";
    return page.name !== 'Home' ? page.name : '';
  },
  meta: [
    {
      name: "description",
      content: "%site.description",
    },
    {
      property: "og:title",
      content: "%site.name",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:description",
      content: "%site.description",
    },
    {
      property: "og:url",
      content: "%site.url",
    },
    {
      property: "og:image",
      content: "%site.url/lunapixu-large.jpg"
    }
  ],
});
</script>

<template>
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
    <navigation />
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
