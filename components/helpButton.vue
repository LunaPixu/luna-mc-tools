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
    <button
      class="tooltip-button"
      style="float: right;"
      type="button"
      @click="closeDialog()"
    >X</button>
    <p class="tiny-header">{{ header }}</p>
    <slot />
  </dialog>
</template>

<style scoped>
</style>