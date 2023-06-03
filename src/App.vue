<script setup>
import TradeReader from './components/TradeReader.vue';
</script>

<template>
  <div class="title">
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
    <h1 style="margin-bottom: 0.5em">Luna's Minecraft Tools</h1>
  </div>
  <TradeReader />
</template>

<style scoped>
.title {
  box-shadow: 0px 0px 5px black;
  background: #0b0632;
  padding-top: 0.5em;
  padding-left: 1em;
  padding-right: 1em;
  display: flex;
  flex-direction: column;
  margin-bottom: 2em;
  position: sticky;
  position: -webkit-sticky;
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
