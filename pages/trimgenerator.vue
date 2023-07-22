<script setup lang="ts">
const desc = "A generator to help quickly add custom armor trims into Minecraft."

useSeoMeta({
  title: "Trim Generator",
  description: desc,
  ogTitle: "%s %separator %site.name",
  ogDescription: desc,
  ogUrl: "%site.url/trimgenerator",
});
</script>

<template>
  <h2>Custom Armor Trim Generator</h2>
  <p>
    This tool creates a data pack and a resource pack scaffold to quickly add your own custom armor trims into
    Minecraft.
  </p>
  <p>
    At present, this tool only allows you to generate one trim material <i>or</i> one trim pattern. Generating more than one
    and/or generating both kinds will not work and will require manual editing on your part to work correctly. Support for
    multiple and mixing-and-matching is coming soon.
  </p>
  <p class="notice">Note: This tool was made for Minecraft Java Edition version 1.20. This tool will not work for Bedrock.</p>
  <ClientOnly>
    <GenerateTrim />
  </ClientOnly>
</template>

<style scoped></style>
