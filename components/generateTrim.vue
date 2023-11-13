<script setup lang="ts">
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Material, Pattern, generatePacks, type InputValues } from "./trim/generatePacks";
import { type Packs, type Pack } from "./trim/pack";

const errorText = ref("");
const packsGenerated = ref(false);
const overwrite = ref(false);

const mcVersion = "1.20.1"; // TODO Make this dynamic

const inputs = ref<InputValues[]>([]);
let id = 0;

function addInput(type: string) {
  switch (type) {
    case "pattern":
      inputs.value.push(new Pattern(id));
      id++;
      return;
    case "material":
      inputs.value.push(new Material(id));
      id++;
      return;
    default:
      return;
  }
}

function removeInput(input: InputValues) {
  inputs.value = inputs.value.filter((el) => el !== input);
  if (!inputs.value.length) errorText.value = "";
}

let packs: Packs = {
  dataPack: {
    name: "",
    zip: new JSZip(),
  },
  resourcePack: {
    name: "",
    zip: new JSZip(),
  },
};

function submitPacks(values: InputValues[]): void {
  errorText.value = "";
  packsGenerated.value = false;

  try {
    packs = generatePacks(values, mcVersion, overwrite.value);
  } catch (err) {
    if (typeof err === "string") {
      errorText.value = err;
      return;
    }
    throw (err);
  }
  packsGenerated.value = true;
}

function downloadPack(pack: Pack): void {
  pack.zip.generateAsync({ type: "blob" })
    .then(function (blob: Blob) {
      saveAs(blob, `${pack.name}.zip`);
    });
}

const resourceDialog = ref<HTMLDialogElement | null>(null);
function showResourceDialog(): void {
  resourceDialog.value?.showModal();
}
function closeResourceDialog(): void {
  resourceDialog.value?.close();
}
</script>

<template>
  <div class="box" id="trimbox">
    <div class="flex-options">
      <button type="button" class="wide-flex-button" @click="addInput('material')">Add Trim Material</button>
      <button type="button" class="wide-flex-button" @click="addInput('pattern')">Add Trim Pattern</button>
    </div>
    <hr style="margin: 1em 0" />
    <div class="box">
      <template v-if="inputs.length">
        <h4 class="tight-header"><u>Options</u></h4>
        <div class="flex-options" style="justify-content: space-around;">
          <div class="option"><label for="overwrite">Overwrite vanilla values?</label>
            <input type="checkbox" id="overwrite" v-model="overwrite">
            <HelpButton header="Overwriting vanilla values">By default, Luna's MC Tools will safeguard against
              using vanilla values to prevent users from accidentally overwriting them. Users may opt to disable this
              safeguard and allow them to freely overwrite any value.
              <p>Caution: this behaviour is not fully tested/implemented and I cannot guarantee it will work as intended.</p>
            </HelpButton>
          </div>
        </div>
      </template>
      <template v-else>
        <h4 class="tight-header">No materials or patterns have been added</h4>
        <p>To begin generating your custom armor trim data and resource packs, please click either of the above buttons.</p>
      </template>
    </div>
    <form autocomplete="off" @submit.prevent="submitPacks(inputs)">
      <TransitionGroup name="trim">
        <TrimInput
          v-for="input in inputs"
          :input="input"
          @remove="removeInput(input)"
          :key="input.id"
        >
        </TrimInput>
      </TransitionGroup>
      <button class="generate-button" v-show="inputs.length">
        Generate
      </button>
    </form>

    <hr v-if="packsGenerated || errorText" />
    <p v-if="errorText" class="errortext">{{ errorText }}</p>
    <template v-else-if="packsGenerated">
      <p class="tight-header"><u>Download both your resource pack and data pack</u></p>
      <div class="flex-options" id="downloads">
        <button type="button" class="wide-flex-button" @click="showResourceDialog(); downloadPack(packs.resourcePack)">
          Download Resource Pack
        </button>
        <dialog ref="resourceDialog">
          <button
            class="tooltip-button"
            style="float: right;"
            type="button"
            @click="closeResourceDialog()"
          >X</button>
          <p class="tiny-header">Downloading Resource Pack...</p>
          Warning: Resource packs provided by this tool are incomplete and require you to provide textures for them.<br />
          Please check the README inside your resource pack for more information.
        </dialog>
        <button type="button" class="wide-flex-button" @click="downloadPack(packs.dataPack)">
          Download Data Pack
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.trim-enter-active,
.trim-leave-active {
  transition: all 0.3s ease-out;
}
.trim-enter-from {
  transform: translateX(-16px);
  opacity: 0;
}
.trim-leave-to {
  transform: translateX(16px);
  opacity: 0;
}

.generate-button {
  width: auto;
}
#trimbox {
  margin: 0.5em auto;
  max-width: 1000px;
}

@media only screen and (max-width: 750px) {
  .generate-button {
    width: 95%;
  }
}
</style>