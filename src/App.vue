<script setup lang="ts">
import navigation from './components/navigation.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useHeadSafe } from "@unhead/vue";
import { useRoute } from "vue-router";

const route = useRoute();

useHeadSafe({
  titleTemplate: (title) => title ? `${title} / Luna's Minecraft Tools` : "Luna's Minecraft Tools",
  title: () => route.name !== "Home" ? route.name as string : "",
});
</script>

<template>
  <div id="title" class="box">
    <div style="position: relative">
      <img id="lunapixu" src="/lunapixu.png" alt="Luna Pixu's icon" />
      <span id="social">
        <a href="https://twitter.com/luna_pixu" target="_blank"><font-awesome-icon :icon="['fab', 'twitter']"
            class="icon" /></a>
        <a href="https://github.com/lunapixu/" target="_blank"><font-awesome-icon :icon="['fab', 'github']"
            class="icon" /></a>
      </span>
    </div>
    <h1 style="margin: 0.2em 0">Luna's Minecraft Tools</h1>
    <p style="margin: 0.2em 0">
      <i>Miscellaneous Tools for Miscellaneous Minecraft Needs</i>
    </p>
  </div>
  <navigation />
  <div id="page">
    <router-view></router-view>
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
