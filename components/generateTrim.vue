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
      <button type="button" class="wide-button" @click="addInput('material')">Add Trim Material</button>
      <button type="button" class="wide-button" @click="addInput('pattern')">Add Trim Pattern</button>
    </div>
    <hr style="margin: 1em 0" />
    <div class="box" v-if="inputs.length">
      <h4 class="tight-header"><u>Options</u></h4>
      <div class="flex-options" style="justify-content: space-around;">
        <div class="option"><label for="overwrite">Overwrite vanilla values?</label>
          <input type="checkbox" id="overwrite" v-model="overwrite">
          <HelpButton header="Overwriting vanilla values">By default, Luna's Minecraft Tools will safeguard against
            using vanilla values to prevent users from accidentally overwriting them. Users may opt to disable this
            safeguard and allow them to freely overwrite any value.
            <p>Caution: this behaviour is not fully tested/implemented and I cannot guarantee it will work as intended.</p>
          </HelpButton>
        </div>
      </div>
    </div>
    <div class="box" v-else>
      <h4 class="tight-header">No materials or patterns have been added</h4>
      <p><i>To begin generating your custom armor trim data and resource packs, please click either of the above buttons.</i></p>
    </div>
    <form @submit.prevent="submitPacks(inputs)">
      <div
        class="box"
        style="margin: 1em 0.5em; position: relative;"
        v-for="input in inputs"
        :key="input.id"
      >
        <button type="button" class="remove-button" @click="removeInput(input)">X</button>
        <template v-if="input.type === 'material'">
          <h3 class="tight-header">Trim Material</h3>
          <div class="option">
            <label :for="`separator-${input.id}`">Separate material name from material ingredient?</label>
            <input type="checkbox" :id="`separator-${input.id}`" v-model="input.separate">
            <HelpButton header="Separating name and ingredient">
              By default, Luna's Minecraft Tools will generate a trim material with the same name as its ingredient. This
              behaviour is intended for users to quickly make simple vanilla-like trim materials where the name <b>is</b>
              the ingredient such as an "Echo Shard" or a "Prismarine" trim.
              <p>However, users may instead opt to separate the material name and ingredient. This allows for making fancier
                trim materials like, for example, an "Ocean's Essence" trim material made from a Heart of the Sea.</p>
            </HelpButton>
          </div>
          <div class="flex-options">
            <div class="option" v-if="input.separate">
              <label :for="`name-${input.id}`">Material Name</label>
              <HelpButton header="Add a name to your trim material">
                Add a cool name to your trim material and the tool will automatically generate an ID from it.<br />
                For example, a "Fiend's Flames" trim material will get the ID <code>fiends_flames</code>.
                <p class="notice">Note: Only alphabetical characters, dashes "-", and underscores "_" will be preserved in
                  the ID. Spaces will be converted to underscores and any other character type will be stripped from the
                  ID.</p>
              </HelpButton><br />
              <input
                :id="`name-${input.id}`"
                type="text"
                placeholder="Insert Name Here"
                v-model="input.name"
                required
              />
            </div>
            <div class="option">
              <label :for="`ingredient-${input.id}`">Material Ingredient</label>
              <HelpButton header="Add the ID of the trim material's ingredient">
                <p v-show="!input.separate">The tool will automatically generate a name and material ID for your
                  material from the ingredient ID.<br />
                  For example, an "Echo Shard" trim material with ID <code>echo_shard</code> will be generated from
                  <code>minecraft:echo_shard</code>.</p>
                <p>The ID of an item can be found by pressing <kbd>F3+H</kbd> and looking at the bottom of the item tooltip
                  (or you can just check the <a href="https://minecraft.fandom.com/" target="_blank">wiki</a>). An ID
                  usually looks something like <code>minecraft:iron_ingot</code>.</p>
              </HelpButton><br />
              <input
                :id="`ingredient-${input.id}`"
                type="text"
                placeholder="namespace:item_name"
                v-model="input.ingredient"
                required
              />
            </div>
            <div class="option">
              <label :for="`color-${input.id}`">Color of Armor Tooltip</label>
              <HelpButton header="Select a color for the armor trim's tooltip">
                This is determines the color of text that shows for the trim description.<br />
                For example, a piece of armor with a redstone trim will have some red text describing what trim it has.
              </HelpButton><br />
              <input
                :id="`color-${input.id}`"
                type="color"
                v-model="input.color"
                required
              />
            </div>
            <div class="option">
              <label :for="`index-${input.id}`">Model Index</label>
              <HelpButton header="Enter a value for your trim's model index">
                This value allows the game to differentiate your trim material from others while rendering. Do note that all
                0.1 increments from 0.1 to 1.0 (e.g. 0.2, 0.4, and 0.7) are used by vanilla Minecraft.
              </HelpButton><br />
              <input
                :id="`index-${input.id}`"
                type="number"
                step="0.05"
                v-model="input.index"
                required />
            </div>
          </div>
        </template>
        <template v-else-if="input.type === 'pattern'">
          <h3 class="tight-header">Trim Pattern</h3>
          <div class="flex-options">
            <div class="option">
              <label :for="`name-${input.id}`">Pattern Name</label>
              <HelpButton header="Name your trim pattern">
                Add a fancy name to your trim pattern and the tool will automatically generate an ID from it.<br />
                For example, a "Polka Dot" trim pattern will get the ID <code>polka_dot</code>.
                <p class="notice">Note: Only alphabetical characters, dashes "-", and underscores "_" will be preserved in
                  the ID. Spaces will be converted to underscores and any other character type will be stripped from the ID.
                </p>
              </HelpButton><br />
              <input
                :id="`name-${input.id}`"
                type="text"
                placeholder="namespace:item_name"
                v-model="input.name"
                required />
            </div>
            <div class="option">
              <label :for="`ingredient-${input.id}`">Pattern Ingredient</label>
              <HelpButton header="Add the ID of the trim pattern's ingredient">
                The ID of an item can be found by pressing <code>F3+H</code> and looking at the bottom of the item tooltip
                (or you can just check the <a href="https://minecraft.fandom.com/" target="_blank">wiki</a>). An ID
                usually looks something like <code>minecraft:iron_ingot</code>.
              </HelpButton><br />
              <input
                :id="`ingredient-${input.id}`"
                type="text"
                placeholder="namespace:item_name"
                v-model="input.ingredient"
                required
              />
            </div>
          </div>
        </template>
      </div>
      <button class="generate-button" v-show="inputs.length">
        Generate
      </button>
    </form>

    <hr v-if="packsGenerated || errorText" />
    <p v-if="errorText" class="errortext">{{ errorText }}</p>
    <template v-else-if="packsGenerated">
      <p class="tight-header"><u>Download both your resource pack and data pack</u></p>
      <div class="flex-options" id="downloads">
        <button type="button" class="wide-button" @click="showResourceDialog(); downloadPack(packs.resourcePack)">
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
        <button type="button" class="wide-button" @click="downloadPack(packs.dataPack)">
          Download Data Pack
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.wide-button {
  margin-bottom: 0;

  flex: 45%;
}

.remove-button {
  transition: position 0.5s;
  position: absolute;
  right: 4px;
  padding: 4px 6px;
}

.flex-options {
  margin-bottom: 0.5em;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}
.option {
  margin: 0.5em 1em;

  flex: 29%;
}
.generate-button {
  width: auto;
}
#trimbox {
  margin: 0.5em auto;
  max-width: 1000px;
}

@media only screen and (max-width: 750px) {
  .option {
    flex: 95%;
  }
  .generate-button {
    width: 95%;
  }
}
</style>