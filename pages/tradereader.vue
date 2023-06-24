<script setup lang="ts">
import parseVillagerTrades from '../components/parseVillagerTrades.vue';

const desc = "A tool that takes a Minecraft villager's NBT data and produces a human-readable list of its trades."

useHeadSafe({
  meta: [
    {
      name: "description",
      content: desc,
    },
    {
      property: "og:title",
      content: "Trade Reader %seperator %site.name",
    },
    {
      property: "og:description",
      content: desc,
    },
    {
      property: "og:url",
      content: "%site.url/tradereader"
    },
  ]
});
</script>

<template>
  <div>
    <h2>Villager Trade Reader</h2>
    <p>
      This tool takes a villager's NBT data, reads it, and produces a
      human-readable list of the villager's trades.
    </p>
    <p class="notice">
      Note: Trade Reader was made with Minecraft Java&nbspEdition 1.18.2 in
      mind. I cannot guarantee this tool will properly function with other
      versions, nor am I certain if it will work for Bedrock.
    </p>
    <!--
      I have no clue why the parser suddenly became client-only.
      Heck, I have no clue what can and can't be used in SSR...
      All I know is "If it suddenly gives a 500 error, maybe move it to client-only."
      For anyone reading this, this error has something to do with trades being undefined. Good luck.
    -->
    <ClientOnly>
      <parseVillagerTrades />
    </ClientOnly>
  </div>
</template>

<style scoped></style>
