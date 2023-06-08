<script setup>
import { ref, computed } from 'vue';
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
        <a href="https://twitter.com/luna_pixu"
          ><img src="/twitter.svg" class="icon"
        /></a>
        <a href="https://github.com/lunapixu/"
          ><img src="/github.svg" class="icon"
        /></a>
      </span>
    </div>
    <h1 style="margin-bottom: 0.2em">Luna's Minecraft Tools</h1>
  </div>

  <!-- Replace this! -->
  <div id="nav" class="box">
    <span
      ><router-link to="/"><button>Home</button></router-link>
      <router-link to="/tradereader"><button>Trade Reader</button></router-link
      ><router-link to="/trimgenerator"
        ><button>Trim Generator</button></router-link
      ></span
    >
  </div>
  <router-view></router-view>
</template>

<style scoped>
#title {
  padding-left: 1em;
  padding-right: 1em;
  display: flex;
  flex-direction: column;
  position: sticky;
  position: -webkit-sticky;
  max-width: 800px;
  margin: 0 auto;
  margin-bottom: 0.5em;
}
#nav {
  padding-left: 1em;
  padding-right: 1em;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
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
</style>
