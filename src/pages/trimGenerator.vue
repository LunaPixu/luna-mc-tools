<script setup lang="ts">
import { useHeadSafe } from "@unhead/vue"
import { onMounted } from "vue";

onMounted(() => {
  useHeadSafe({
    title: "Trim Generator / Luna's Minecraft Tools",
    meta: [
      {
        property: "og:title",
        content: "Trim Generator / Luna's Minecraft Tools",
      },
      {
        property: "og:description",
        content: "Not yet implemented...",
      },
      {
        property: "og:url",
        content: "https://luna-minecraft-tools.vercel.app/trimgenerator"
      },
    ]
  })
});
</script>

<template>
  <h2>Armor Trim Generator</h2>
  <p class="notice">Not yet implemented!</p>
</template>

<style scoped></style>
