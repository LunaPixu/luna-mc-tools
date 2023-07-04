<script setup lang="ts">
import JSZip from "jszip";

interface TrimObj {
  material: string;
  color: string;
  index: number;
}
const trimvalues: TrimObj = reactive({
  material: "",
  color: "#000000",
  index: 0.5,
});
const errorText = ref("");
const test = ref(false);

function generateTrim(values: TrimObj) {
  errorText.value = "";

  if (!values.material) {
    errorText.value = "No material was provided.";
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
      <div class="option">
        <label for="material-box">Trim Material</label>
        <HelpButton id="material"><u>Add the ID of the material of your trim</u><br />
          The ID of an item can be found by pressing <code>F3+H</code> and looking at the bottom of the item tooltip (or
          you can just check the wiki).<br />
          An ID usually looks something like "minecraft:iron_ingot".</HelpButton><br />
        <input id="material-box" type="text" placeholder="namespace:item_name" v-model="trimvalues.material" />
      </div>
      <div class="option">
        <label for="tooltip-color">Color of Armor Tooltip</label>
        <HelpButton id="color"><u>Select a color for the armor trim's tooltip</u><br />
          This is determines the color of text that shows for the trim description.<br />
          For example, a piece of armor with a redstone trim will have some red text describing what trim it has.
        </HelpButton><br />
        <input id="tooltip-color" type="color" v-model="trimvalues.color" />
      </div>
      <div class="option">
        <label for="model-index">Model Index</label>
        <HelpButton id="index"><u>Enter a value for your trim's model index</u><br />
          This value allows the game to differentiate your trim from others while rendering.</HelpButton><br />
        <input id="model-index" type="number" step="0.1" v-model="trimvalues.index" />
      </div>
    </div>
    <button type="button" id="generate-button" @click="generateTrim(trimvalues)">
      Generate
    </button>
    <hr v-if="test || errorText" />
    <p v-if="errorText" class="errortext">{{ errorText }}</p>
    <div v-else-if="test" class="flex-options" id="downloads">
      <button type="button" class="download-button" @click="downloadResourcePack()">
        Download Resource Pack
      </button>
      <button type="button" class="download-button" @click="downloadDatapack()">
        Download Datapack
      </button>
    </div>
  </div>
</template>

<style scoped>
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

.download-button {
  margin-bottom: 0;

  flex: 45%;
}

@media only screen and (max-width: 750px) {
  .option {
    flex: 95%;
  }
  #generate-button {
    width: 95%;
  }
  .download-button {
    flex: 95%;
  }
}
</style>