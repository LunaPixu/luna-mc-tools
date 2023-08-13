<script setup lang="ts">
import { type InputValues } from './generatePacks';
defineProps({
  input: { type: Object as PropType<InputValues>, required: true}
});
</script>

<template>
  <div class="box" style="margin: 1em 0.5em; position: relative;">
    <button type="button" class="showhide-button" @click="input.show = !input.show">
      <template v-if="input.show"><font-awesome-icon icon="eye"/></template>
      <template v-else><font-awesome-icon icon="eye-slash" /></template>
    </button>
    <button type="button" class="remove-button" @click="$emit('remove')">X</button>
    <h3 class="tight-header">{{input.type === "material" ? "Trim Material" : "Trim Pattern"}}</h3>
    <Transition name="showhide">
      <div v-show="input.show">
        <template v-if="input.type === 'material'">
          <div class="option">
            <label :for="`separator-${input.id}`">Separate material name from material ingredient?</label>
            <input type="checkbox" :id="`separator-${input.id}`" v-model="input.separate">
            <HelpButton header="Separating name and ingredient">
              By default, Luna's Minecraft Tools will generate a trim material with the same name as its ingredient. This
              behaviour is intended for users to quickly make simple vanilla-like trim materials where the name <em>is</em>
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
    </Transition>
  </div>
</template>

<style scoped>
.showhide-enter-active,
.showhide-leave-active {
  transition: all 0.3s ease-out;
}
.showhide-enter-from,
.showhide-leave-to {
  transform: translateY(-16px);
  opacity: 0;
}

.remove-button {
  position: absolute;
  top: 2px;
  right: 4px;
  padding: 6px 8px;
  width: 40px;
}
.showhide-button {
  position: absolute;
  top: 2px;
  left: 4px;
  padding: 6px 8px;
  width: 40px;
}
</style>