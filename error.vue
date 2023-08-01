<template>
  <h2>An Error Has Occured</h2>
  <p>Error {{ error.statusCode }} {{ error.statusMessage ? `- ${error.statusMessage}` : "" }}</p>
  <p>Please contact Luna Pixu if this error persists.</p>
  <button @click="handleError">Return to website</button>
</template>

<script setup>
const props = defineProps({
  error: Object
})

const handleError = () => clearError({ redirect: '/' })
</script>