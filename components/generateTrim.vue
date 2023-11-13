<script setup lang="ts">
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { type MaterialValues, generateMaterial } from "./trim/generateMaterial";
import { type PatternValues, generatePattern } from "./trim/generatePattern";
import { type Packs, type Pack } from "./trim/pack";

const materialValues: MaterialValues = reactive({
  name: "",
  ingredient: "",
  color: "#000000",
  index: 0.55,
  overwrite: false,
});

const patternValues: PatternValues = reactive({
  name: "",
  ingredient: "",
  overwrite: false,
});

const errorText = ref("");
const ingredientsSeparated = ref(false);
const generatorToggled = ref(false);
const packsGenerated = ref(false);

const mcVersion = "1.20.1"; // TODO Make this dynamic

function toggleGenerator(dest: boolean): void {
  errorText.value = "";
  packsGenerated.value = false;
  generatorToggled.value = dest;
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

function generateMaterialPacks(values: MaterialValues): void {
  errorText.value = "";
  packsGenerated.value = false;

  if (!materialValues.overwrite && values.index <= 1 && !(values.index * 10 % 1)) {
    errorText.value = "Index number is already used by the vanilla game. Please select a different index number."
    return;
  }

  const input: MaterialValues = ingredientsSeparated.value ? values :
    {
      ingredient: values.ingredient,
      color: values.color,
      index: values.index,
      overwrite: values.overwrite,
    };

  try {
    packs = generateMaterial(input, mcVersion);
  } catch (err) {
    if (typeof err === "string") {
      errorText.value = err;
      return;
    }
    throw (err);
  }
  packsGenerated.value = true;
}

function generatePatternPacks(values: PatternValues): void {
  errorText.value = "";
  packsGenerated.value = false;

  try {
    packs = generatePattern(values, mcVersion);
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
      <button type="button" class="wide-button" @click="toggleGenerator(false)">Trim Material Generator</button>
      <button type="button" class="wide-button" @click="toggleGenerator(true)">Trim Pattern Generator</button>
    </div>
    <hr style="margin: 1em 0" />

    <template v-if="!generatorToggled">
      <h3 class="tight-header">Trim Material</h3>
      <div class="box">
        <h4 class="tight-header"><u>Options</u></h4>
        <div class="flex-options" style="justify-content: space-around;">
          <div class="option"><label for="separator">Separate material name from material ingredient?</label>
            <input type="checkbox" id="separator" v-model="ingredientsSeparated">
            <HelpButton header="Separating name and ingredient">By default, Luna's MC Tools will
              generate a trim material with the same name as its ingredient. This behaviour is intended for users to quickly
              make simple vanilla-like trim materials where the name <b>is</b> the ingredient such as an "Echo Shard" or a
              "Prismarine" trim.
              <p>However, users may instead opt to separate the material name and ingredient. This allows for making fancier
                trim materials like, for example, an "Ocean's Essence" trim material made from a Heart of the Sea.</p>
            </HelpButton>
          </div>
          <div class="option"><label for="overwrite">Overwrite vanilla values?</label>
            <input type="checkbox" id="overwrite" v-model="materialValues.overwrite">
            <HelpButton header="Overwriting vanilla values">By default, Luna's MC Tools will safeguard against
              using vanilla values to prevent users from accidentally overwriting them. Users may opt to disable this
              safeguard and allow them to freely overwrite any value.
              <p>Caution: this behaviour is not fully tested/implemented and I cannot guarantee it will work as intended.</p>
            </HelpButton>
          </div>
        </div>
      </div>
      <form @submit.prevent="generateMaterialPacks(materialValues)">
        <div class="box">
          <h4 class="tight-header"><u>Material Values</u></h4>
          <div class="flex-options">
            <div class="option" v-if="ingredientsSeparated">
              <label for="material-name">Material Name</label>
              <HelpButton header="Add a name to your trim material">
                Add a cool name to your trim material and the tool will automatically generate an ID from it.<br />
                For example, a "Fiend's Flames" trim material will get the ID <code>fiends_flames</code>.
                <p class="notice">Note: Only alphabetical characters, dashes "-", and underscores "_" will be preserved in
                  the ID. Spaces will be converted to underscores and any other character type will be stripped from the
                  ID.</p>
              </HelpButton><br />
              <input
                id="material-name"
                type="text"
                placeholder="Insert Name Here"
                v-model="materialValues.name"
                required
              />
            </div>
            <div class="option">
              <label for="material-ingredient">Material Ingredient</label>
              <HelpButton header="Add the ID of the trim material's ingredient">
                <p v-show="!ingredientsSeparated">The tool will automatically generate a name and material ID for your
                  material from the ingredient ID.<br />
                  For example, an "Echo Shard" trim material with ID <code>echo_shard</code> will be generated from
                  <code>minecraft:echo_shard</code>.</p>
                <p>The ID of an item can be found by pressing <kbd>F3+H</kbd> and looking at the bottom of the item tooltip
                  (or you can just check the <a href="https://minecraft.wiki/" target="_blank">wiki</a>). An ID
                  usually looks something like <code>minecraft:iron_ingot</code>.</p>
              </HelpButton><br />
              <input
                id="material-ingredient"
                type="text"
                placeholder="namespace:item_name"
                v-model="materialValues.ingredient"
                required
              />
            </div>
            <div class="option">
              <label for="tooltip-color">Color of Armor Tooltip</label>
              <HelpButton header="Select a color for the armor trim's tooltip">
                This is determines the color of text that shows for the trim description.<br />
                For example, a piece of armor with a redstone trim will have some red text describing what trim it has.
              </HelpButton><br />
              <input
                id="tooltip-color"
                type="color"
                v-model="materialValues.color"
                required
              />
            </div>
            <div class="option">
              <label for="model-index">Model Index</label>
              <HelpButton header="Enter a value for your trim's model index">
                This value allows the game to differentiate your trim material from others while rendering. Do note that all
                0.1 increments from 0.1 to 1.0 (e.g. 0.2, 0.4, and 0.7) are used by vanilla Minecraft.
              </HelpButton><br />
              <input
                id="model-index"
                type="number"
                step="0.05"
                v-model="materialValues.index"
                required />
            </div>
          </div>
        </div>
        <button id="generate-button">
          Generate
        </button>
      </form>
    </template>

    <template v-else>
      <h3 class="tight-header">Trim Pattern</h3>
      <div class="box">
        <h4 class="tight-header"><u>Options</u></h4>
        <div class="flex-options">
          <div class="option">
            <label for="overwrite">Overwrite vanilla values?</label>
            <input type="checkbox" id="overwrite" v-model="patternValues.overwrite">
            <HelpButton header="Overwriting vanilla values">By default, Luna's MC Tools will safeguard against
              using vanilla values to prevent users from accidentally overwriting them. Users may opt to disable this
              safeguard and allow them to freely overwrite any value.
              <p>Caution: this behaviour is not fully tested/implemented and I cannot guarantee it will work as intended.</p>
            </HelpButton>
          </div>
        </div>
      </div>
      <form @submit.prevent="generatePatternPacks(patternValues)">
        <div class="box">
          <h4 class="tight-header"><u>Pattern Values</u></h4>
          <div class="flex-options">
            <div class="option">
              <label for="pattern-name">Pattern Name</label>
              <HelpButton header="Name your trim pattern">
                Add a fancy name to your trim pattern and the tool will automatically generate an ID from it.<br />
                For example, a "Polka Dot" trim pattern will get the ID <code>polka_dot</code>.
                <p class="notice">Note: Only alphabetical characters, dashes "-", and underscores "_" will be preserved in
                  the ID. Spaces will be converted to underscores and any other character type will be stripped from the ID.
                </p>
              </HelpButton><br />
              <input
                id="pattern-name"
                type="text"
                placeholder="namespace:item_name"
                v-model="patternValues.name"
                required />
            </div>
            <div class="option">
              <label for="pattern-ingredient">Pattern Ingredient</label>
              <HelpButton header="Add the ID of the trim pattern's ingredient">
                The ID of an item can be found by pressing <code>F3+H</code> and looking at the bottom of the item tooltip
                (or you can just check the <a href="https://minecraft.fandom.com/" target="_blank">wiki</a>). An ID
                usually looks something like <code>minecraft:iron_ingot</code>.
              </HelpButton><br />
              <input
                id="pattern-ingredient"
                type="text"
                placeholder="namespace:item_name"
                v-model="patternValues.ingredient"
                required
              />
            </div>
          </div>
        </div>
        <button class="generate-button">
          Generate
        </button>
      </form>
    </template>

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