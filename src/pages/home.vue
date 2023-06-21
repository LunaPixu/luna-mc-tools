<script setup lang="ts">
import { useHeadSafe } from '@unhead/vue'

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
  <h2>Welcome to my Minecraft Tools!</h2>
  <p>
    Here you may find several tools that'll help you in your Minecraft
    endeavours.<br />
    If you have a specific problem or need, we might have just the thing for
    you! Take a look around and check out what we have to offer.
  </p>
  <p>
    If there's something that you feel like we should provide, drop a suggestion
    on
    <a href="https://github.com/lunapixu/minecraft-tools" target="_blank">the Github repo</a>
    or contact
    <a href="https://twitter.com/luna_pixu" target="_blank">Luna&nbsp;Pixu</a>
    on Twitter
  </p>
</template>

<style scoped></style>
