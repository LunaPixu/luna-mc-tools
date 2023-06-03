<script setup>
import { ref } from 'vue';

const errorText = ref('');

function sanitiseNBT(data) {
  let sanitised = data.replace(/(:\d+)[bslf]/gm, '$1');
  sanitised = sanitised.replace(
    /(?<=[\{,\[])(?<!")([^\{\}\[\]"',]+):/gm,
    `"$1":`
  );
  sanitised = sanitised.replace(/'(?=[\{\[])|(?<=[\}\]])'/gm, '');
  sanitised = sanitised.replace(/'/gm, `"`);
  return sanitised;
}

function capitalisePhrase(phrase) {
  return phrase
    .match(/[a-z0-9]+/gi)
    .map((word) => {
      return word
        .split('')
        .map((l, i) => (i == 0 ? l.toUpperCase() : l.toLowerCase()))
        .join('');
    })
    .join(' ');
}

function parseTradeItem(item) {
  let itemName = '';
  if (item.tag) {
    if (item.tag.display) {
      if (item.tag.display.Name) {
        itemName = item.tag.display.Name.text;
      }
    }
  }
  if (itemName === '') {
    itemName = item.id;
    itemName = itemName.replace(/minecraft:(.+)/gm, '$1');
    itemName = capitalisePhrase(itemName);
  }
  return `${item.Count} ${itemName}`;
}

function parseVillagerTrades(data) {
  errorText.value = '';
  if (!data) {
    errorText.value = 'No NBT data provided...';
    throw new Error('No NBT data provided.');
  }
  if (data[0] != '{' || data.at(-1) != '}') {
    errorText.value = 'Invalid NBT data provided.';
    throw new Error('Invalid NBT data provided.');
  }
  let vendorNBT = data;
  vendorNBT = sanitiseNBT(vendorNBT);
  //console.log(vendorNBT);

  let vendor;
  try {
    vendor = JSON.parse(vendorNBT);
  } catch {
    errorText.value =
      'NBT data is either invalid or malformed, or an unexpected error occured during parsing. Please check your NBT data. If it continues to fail, please contact Luna Pixu.';
    throw new Error(
      'NBT data is either malformed or was not properly sanitised when parsing. Please check your NBT data. If it continues to fail, please contact Luna Pixu.'
    );
  }
  let vendorName = vendor.CustomName ? vendor.CustomName.text : 'Vendor';

  console.log(`${vendorName}:`);
  vendor.Offers.Recipes.forEach((trade, i) => {
    //console.log(trade);
    console.log(
      (trade.buy ? parseTradeItem(trade.buy) : '') +
        (trade.buyB && trade.buy ? ' and ' : '') +
        (trade.buyB ? parseTradeItem(trade.buyB) : '') +
        ` for ${parseTradeItem(trade.sell)}`
    );
  });
}

const NBTData = ref('');
</script>

<template>
  <h2>Villager Trade Reader</h2>
  <p>AGGA</p>
  <div class="box">
    <form>
      <label for="NBTBox">Enter vendor NBT data:</label><br />
      <textarea
        name="NBTBox"
        id="NBTBox"
        cols="50"
        rows="10"
        placeholder="{Offers:{Recipes:[{...}]}}"
        v-model="NBTData"
      ></textarea
      ><br />
      <button
        type="button"
        @click="parseVillagerTrades(NBTData)"
        style="margin-bottom: 0.5em"
      >
        Submit
      </button>
    </form>
    <hr v-if="output || errorText" />
    <p v-if="errorText" style="color: red">{{ errorText }}</p>
  </div>
</template>

<style scoped>
#NBTBox {
  resize: vertical;
  margin: 0.5em;
}
</style>
