<script setup lang="ts">
defineProps({
  header: { type: String, required: true },
});

const dialog = ref<HTMLDialogElement | null>(null);
function showDialog(): void {
  dialog.value?.showModal();
}
function closeDialog(): void {
  dialog.value?.close();
}
</script>

<template>
  <button class="tooltip-button" type="button" @click="showDialog()">?</button>
  <dialog ref="dialog">
    <button class="tooltip-button" id="close-button" type="button" @click="closeDialog()">X</button>
    <p class="tiny-header">{{ header }}</p>
    <slot />
  </dialog>
</template>

<style scoped>
#close-button {
  float: right;
}
</style>