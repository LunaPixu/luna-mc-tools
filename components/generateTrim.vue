<script setup lang="ts">
import JSZip from "jszip";

interface MaterialValues {
  material?: string;
  name?: string;
  ingredient?: string;
  color: string;
  index?: number;
}
const materialValues: MaterialValues = reactive({
  material: "",
  name: "",
  ingredient: "",
  color: "#000000",
  index: 0.55,
});

interface PatternValues {
  name: string;
  ingredient: string;
}
const patternValues: PatternValues = reactive({
  name: "",
  ingredient: "",
})

const errorText = ref("");
const ingredientsSeparated = ref(false);
const generatorToggled = ref(false);
const test = ref(false);

function toggleGenerator(dest: boolean): void {
  errorText.value = "";
  test.value = false;
  generatorToggled.value = dest;
}

function generateMaterial(values: MaterialValues) {
  errorText.value = "";

  if (!ingredientsSeparated.value && !values.material) {
    errorText.value = "No material was provided.";
    return;
  }
  if (ingredientsSeparated.value && !values.name) {
    errorText.value = "Trim material has no name.";
    return;
  }
  if (ingredientsSeparated.value && !values.ingredient) {
    errorText.value = "No ingredient was provided.";
    return;
  }

  test.value = true;
}

function generatePattern(values: PatternValues) {
  errorText.value = "";

  if (!values.name) {
    errorText.value = "Trim pattern has no name.";
    return;
  }
  if (!values.ingredient) {
    errorText.value = "No ingredient was provided.";
    return;
  }

  test.value = true;
}

function downloadResourcePack(): void {

}

function downloadDatapack(): void {

}
</script>

<template>
  <div class="box" id="trimbox">
    <div class="flex-options">
      <button type="button" class="wide-button" @click="toggleGenerator(false)">Generate Trim Material</button>
      <button type="button" class="wide-button" @click="toggleGenerator(true)">Generate Trim Pattern</button>
    </div>
    <hr style="margin: 1em 0" />

    <div v-if="!generatorToggled">
      <h3 class="tight-header">Trim Material</h3>
      <div style="margin: 0.5em 0">
        <u>Separate material name from material ingredient?</u>
        <input type="checkbox" id="separator" v-model="ingredientsSeparated">
        <HelpButton id="separator" header="Separating name and ingredient">By default, Luna's Minecraft Tools will
          generate a trim material with the same name as its ingredient. This behaviour is intended for users to quickly
          make simple vanilla-like trim materials where the name <b>is</b> the ingredient such as an "Echo Shard" or a
          "Prismarine" trim.
          <p>Users may instead opt to separate the material name and ingredient. This allows for making fancier trim
            materials like, for example, an "Ocean's Essence" trim material made from a Heart of the Sea.</p>
        </HelpButton>
      </div>
      <div class="flex-options">
        <div class="option" v-if="ingredientsSeparated">
          <label for="material-name">Material Name</label>
          <HelpButton id="material-name" header="Add a name to your trim material">
            Add a cool name to your trim material and the tool will automatically generate an ID from it.<br />
            For example, a "Fiend's Flames" trim material will get the ID <code>fiends_flames</code>.
            <p class="notice">Note: Only alphabetical characters, dashes "-", and underscores "_" will be preserved in the
              ID. Spaces will be converted to underscores and any other character type will be stripped from the ID.</p>
          </HelpButton><br />
          <input id="material-name" type="text" placeholder="Insert Name Here" v-model="materialValues.name">
        </div>
        <div class="option" v-else>
          <label for="material-box">Material Ingredient</label>
          <HelpButton id="material" header="Add the ID of the trim material's ingredient">
            The tool will automatically generate a name and material ID for your material from the ingredient ID.<br />
            For example, an "Echo Shard" trim material with ID <code>echo_shard</code> will be generated from
            <code>minecraft:echo_shard</code>.<br />
            <p>The ID of an item can be found by pressing <code>F3+H</code> and looking at the bottom of the item tooltip
              (or you can just check the <a href="https://minecraft.fandom.com/" target="_blank">wiki</a>). An ID usually
              looks something like <code>minecraft:iron_ingot</code>.</p>
          </HelpButton><br />
          <input id="material-box" type="text" placeholder="namespace:item_name" v-model="materialValues.material" />
        </div>
        <div class="option" v-if="ingredientsSeparated">
          <label for="material-ingredient">Material Ingredient</label>
          <HelpButton id="material-ingredient" header="Add the ID of the trim material's ingredient">
            The ID of an item can be found by pressing <code>F3+H</code> and looking at the bottom of the item tooltip (or
            you can just check the <a href="https://minecraft.fandom.com/" target="_blank">wiki</a>). An ID usually looks
            something like <code>minecraft:iron_ingot</code>.
          </HelpButton><br />
          <input id="material-ingredient" type="text" placeholder="namespace:item_name"
            v-model="materialValues.ingredient" />
        </div>
        <div class="option">
          <label for="tooltip-color">Color of Armor Tooltip</label>
          <HelpButton id="color" header="Select a color for the armor trim's tooltip">
            This is determines the color of text that shows for the trim description.<br />
            For example, a piece of armor with a redstone trim will have some red text describing what trim it has.
          </HelpButton><br />
          <input id="tooltip-color" type="color" v-model="materialValues.color" />
        </div>
        <div class="option">
          <label for="model-index">Model Index</label>
          <HelpButton id="index" header="Enter a value for your trim's model index">
            This value allows the game to differentiate your trim material from others while rendering. Do note that all 0.1
            increments from 0.1 to 1.0 (e.g. 0.2, 0.4, and 0.7) are used by vanilla Minecraft.
          </HelpButton><br />
          <input id="model-index" type="number" step="0.05" v-model="materialValues.index" />
        </div>
      </div>
      <button type="button" id="generate-button" @click="generateMaterial(materialValues)">
        Generate
      </button>
    </div>

    <div v-else>
      <h3 class="tight-header">Trim Pattern</h3>
      <div class="flex-options">
        <div class="option">
          <label for="pattern-name">Pattern Name</label>
          <HelpButton id="pattern-name" header="Name your trim pattern">
            Add a fancy name to your trim pattern and the tool will automatically generate an ID from it.<br />
            For example, a "Polka Dot" trim pattern will get the ID <code>polka_dot</code>.
            <p class="notice">Note: Only alphabetical characters, dashes "-", and underscores "_" will be preserved in the
              ID. Spaces will be converted to underscores and any other character type will be stripped from the ID.</p>
          </HelpButton><br />
          <input id="pattern-name" type="text" placeholder="namespace:item_name" v-model="patternValues.name">
        </div>
        <div class="option">
          <label for="pattern-ingredient">Pattern Ingredient</label>
          <HelpButton id="pattern-ingredient" header="Add the ID of the trim pattern's ingredient">
            The ID of an item can be found by pressing <code>F3+H</code> and looking at the bottom of the item tooltip (or
            you can just check the <a href="https://minecraft.fandom.com/" target="_blank">wiki</a>). An ID usually looks
            something like <code>minecraft:iron_ingot</code>.
          </HelpButton><br />
          <input id="pattern-ingredient" type="text" placeholder="namespace:item_name" v-model="patternValues.ingredient">
        </div>
      </div>
      <button type="button" id="generate-button" @click="generatePattern(patternValues)">
        Generate
      </button>
    </div>

    <hr v-if="test || errorText" />
    <p v-if="errorText" class="errortext">{{ errorText }}</p>
    <div v-else-if="test" class="flex-options" id="downloads">
      <button type="button" class="wide-button" @click="downloadResourcePack()">
        Download Resource Pack
      </button>
      <button type="button" class="wide-button" @click="downloadDatapack()">
        Download Data Pack
      </button>
    </div>
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
  margin: 0 1em;
  margin-bottom: 0.5em;
  flex: 29%;
}
#trimbox {
  margin: 0.5em auto;
  max-width: 1000px;
}
#generate-button {
  width: auto;
}

@media only screen and (max-width: 750px) {
  .option {
    flex: 95%;
  }
  #generate-button {
    width: 95%;
  }
}
</style>