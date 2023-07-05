<script setup lang="ts">
const desc = "A basic generator to help quickly add custom armor trims into Minecraft."

useSeoMeta({
  description: desc,
  ogTitle: "Trim Generator %seperator %site.name",
  ogDescription: desc,
  ogUrl: "%site.url/trimgenerator",
});
</script>

<template>
  <div>
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
  </div>
</template>

<style scoped></style>
