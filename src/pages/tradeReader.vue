<script setup lang="ts">
import parseVillagerTrades from '../components/parseVillagerTrades.vue';
import { useHeadSafe } from "@unhead/vue";

useHeadSafe({
  meta: [
    {
      property: "og:title",
      content: "Trade Reader / Luna's Minecraft Tools",
    },
    {
      property: "og:description",
      content: "A tool that takes a Minecraft villager's NBT data and produces a human-readable list of its trades.",
    },
    {
      property: "og:url",
      content: "https://luna-minecraft-tools.vercel.app/tradereader"
    },
  ]
});
</script>

<template>
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
  <parseVillagerTrades />
</template>

<style scoped></style>
