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
    As I am overhauling this generator, some parts of the generator might not be functioning as intended. Until I am done, 
    I cannot guarantee that your resource and data packs will function properly. Please use the
    <a href="https://lunamctools.vercel.app/trimgenerator" target="_blank">live version</a> of the generator in the
    meantime.
  </p>
  <p class="notice">Note: This tool was made for Minecraft Java Edition version 1.20. This tool will not work for Bedrock.</p>
  <ClientOnly>
    <GenerateTrim />
  </ClientOnly>
</template>

<style scoped></style>
