<script setup>
import { ref, computed } from 'vue';
import navigation from "./components/navigation.vue"
</script>

<template>
  <div id="title" class="box">
    <div style="position: relative">
      <img
      class="lunapixu"
      src="/src/assets/lunapixu.png"
      alt="Luna Pixu's icon"
      />
      <span class="social">
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
    <h1 style="margin-bottom: 0.2em">Luna's Minecraft Tools</h1>
  </div>
  <navigation />
  <div id="page">
    <router-view></router-view>
  </div>
</template>

<style scoped>
#page {
  margin-left: 192px;
  /* I have no clue why the width is this figure! Why 256 specifically?! */
  width: calc(100vw - 256px);
  padding: 0 2rem;
}
#title {
  margin-left: 192px;
  margin-right: 0px;
  margin-top: 0px;
  padding: 1em 2em;
  width: calc(100vw - 256px);
  border-radius: 0px;
}
.social {
  text-align: right;
  position: absolute;
  inset-inline: calc(65%) 0;
}
.lunapixu {
  box-shadow: 0px 0px 5px black;
  margin-bottom: -1.5em;
}
.icon {
  height: 32px;
  margin-left: 0.5em;
}

@media only screen and (max-width: 750px) {
  #page {
    margin-left: 0;
    width: auto;
  }
  #title {
    padding: 1em;
    width: auto;
    max-width: 800px;
    min-width: 300px;
    margin: 0 auto;
    margin-bottom: 0.5em;
    border-radius: 10px;
  }
}
</style>
