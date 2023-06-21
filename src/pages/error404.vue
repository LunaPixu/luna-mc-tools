<script setup lang="ts">
import { useHeadSafe } from "@unhead/vue";

useHeadSafe({
  meta: [
    {
      property: "og:title",
      content: "Luna's Minecraft Tools",
    },
    {
      property: "og:description",
      content: "A collection of miscellaneous Minecraft tools for various Minecraft needs.",
    },
    {
      property: "og:url",
      content: "https://luna-minecraft-tools.vercel.app/"
    },
  ]
});
</script>

<template>
  <h2>Error 404: Not Found</h2>
</template>

<style scoped></style>
