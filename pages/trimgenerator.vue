<script setup lang="ts">
const desc = "A basic generator to help quickly add custom armor trims into Minecraft."

useSeoMeta({
  title: "Trim Generator",
  description: desc,
  ogTitle: "%s %separator %site.name",
  ogDescription: desc,
  ogUrl: "%site.url/trimgenerator",
});
</script>

<template>
  <h2>Armor Trim Generator</h2>
  <p>
    This tool quickly creates a data pack and resource pack scaffold to quickly add your own custom armor trims into
    Minecraft.
  </p>
  <p class="notice">(Currently, this tool is not fully functional. Clicking the Generate Button will not actually generate any
    files. The download buttons will also do nothing.)</p>
  <p class="notice">Note: This tool was made for Minecraft Java Edition version 1.20. This tool will not work for Bedrock.</p>
  <ClientOnly>
    <GenerateTrim />
  </ClientOnly>
</template>

<style scoped></style>
