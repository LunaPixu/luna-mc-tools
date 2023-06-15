<script setup>
import { ref, computed } from 'vue';
import navigation from "./components/navigation.vue"
</script>

<template>
  <div id="title" class="box">
    <div style="position: relative">
      <img
      id="lunapixu"
      src="/src/assets/lunapixu.png"
      alt="Luna Pixu's icon"
      />
      <span id="social">
        <a
        href="https://twitter.com/luna_pixu"
        target="_blank"
        ><img src="/twitter.svg" class="icon"
        /></a>
        <a
        href="https://github.com/lunapixu/"
        target="_blank"
        ><img src="/github.svg" class="icon"
        /></a>
      </span>
    </div>
    <h1 style="margin: 0.2em 0">Luna's Minecraft Tools</h1>
    <p style="margin: 0.2em 0"><i>Miscellaneous Tools for Miscellaneous Minecraft Needs</i></p>
  </div>
  <navigation />
  <div id="page">
    <router-view></router-view>
  </div>
</template>

<style scoped>
#page {
  margin-left: calc(var(--sidebar-width) + 16px);
  /** 80px comes from the padding of the sidebar and page content. (8+8+32+32) */
  width: calc(100vw - var(--sidebar-width) - 80px);
  padding: 0 2rem;
}
#title {
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
.icon {
  height: 32px;
  margin-left: 0.5em;
}

@media only screen and (max-width: 750px) {
  #page {
    margin-left: 0;
    width: auto;
    padding: 0;
  }
  #title {
    padding: 1em;
    padding-bottom: 0.5em;
    width: auto;
    max-width: 800px;
    min-width: 300px;
    margin: 0 auto;
    margin-bottom: 0.5em;
    border-radius: 10px;
  }
}
</style>
