<script setup lang="ts">
const route = useRoute();
</script>

<template>
  <h2>Error 404: Not Found</h2>
  <p>
    The page "{{ route.path }}" does not exist.<br />
    It may have been moved, removed, or is not present on this version of Luna's MC Tools.
  </p>
  <p>Please double-check the URL. If you believe your URL is valid and shouldn't route to this 404 page, please contact Luna Pixu.</p>
</template>

<style scoped></style>
