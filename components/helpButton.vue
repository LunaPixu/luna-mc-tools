<script setup lang="ts">
const props = defineProps({
  id: { type: String, required: true },
  header: { type: String },
});
function showDialog(): void {
  const dialog = document.getElementById(`${props.id}-helpdialog`) as HTMLDialogElement;
  dialog.showModal();
}
function closeDialog(): void {
  const dialog = document.getElementById(`${props.id}-helpdialog`) as HTMLDialogElement;
  dialog.close();
}
</script>

<template>
  <button class="tooltip-button" type="button" @click="showDialog()">?</button>
  <dialog :id="`${id}-helpdialog`">
    <button class="tooltip-button" id="close-button" type="button" @click="closeDialog()">X</button>
    <p v-if="header"><u>{{ header }}</u></p>
    <p>
      <slot />
    </p>
  </dialog>
</template>

<style scoped>
#close-button {
  float: right;
}
</style>