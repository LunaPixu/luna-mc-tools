<script setup lang="ts">
const desc = "A tool that takes a Minecraft villager's NBT data and produces a human-readable list of its trades."

useSeoMeta({
  title: "Trade Reader",
  description: desc,
  ogTitle: "%s %separator %site.name",
  ogDescription: desc,
  ogUrl: "%site.url/tradereader",
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
    <ClientOnly>
      <ParseVillagerTrades />
    </ClientOnly>
  </div>
</template>

<style scoped></style>
