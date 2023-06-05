<script setup>
import { ref } from 'vue';
import { reactive } from 'vue';

const errorText = ref('');

function sanitiseNBT(data) {
  let sanitised = data.replace(/(:\d+)[bslf]/gm, '$1'); // Strip number/boolean definitions
  // TODO: convert boolean values instead
  sanitised = sanitised.replace(
    /(?<=[\{,\[])(?<!")([^\{\}\[\]"',]+):/gm,
    `"$1":`
  ); // Format property names
  sanitised = sanitised.replace(/'(?=[\{\[])|(?<=[\}\]])'/gm, ''); //Strip random ' characters surrounding objs/arrays
  sanitised = sanitised.replace(/(?<!\\)'/gm, `"`); //Make strings uniform (but preserve ' characters in text)
  sanitised = sanitised.replace(/\\(?=\\["']|'|\\n)/gm, ''); //Strip unnecessary escape characters
  console.log(sanitised);
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
    itemName = itemName.match(/(?<=:).*/gi)[0];
    itemName = capitalisePhrase(itemName);
  }
  return `${item.Count} ${itemName}`;
}

function nameEggs(name) {
  let newName = name;
  let lunaNames = ['LunaPixu', 'Luna Pixu', 'Luna_Pixu', 'Luna-Pixu'];
  let basedNames = ['Shanoa', 'Yan Vismok', 'Samus'];
  let lovelyNames = ['Amaryllis', 'Trista', 'Trista Lundin', 'Lala Hagoromo'];
  if (lunaNames.some((el) => el == name)) newName += ' (Awww... Thanks!)';
  if (basedNames.some((el) => el == name)) newName += ' (Based!)';
  if (lovelyNames.some((el) => el == name)) newName += ' (❤)';
  return newName;
}

const tradeDisplay = reactive({ name: '', trades: [] });

function parseVillagerTrades(data) {
  tradeDisplay.name = '';
  tradeDisplay.trades = [];
  errorText.value = '';

  if (!data) {
    errorText.value = 'No NBT data provided...';
    return;
  }
  if (data[0] != '{' || data.at(-1) != '}') {
    errorText.value =
      "Invalid NBT data provided. NBT data must be contained within braces '{ }'.";
    return;
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
    console.log(
      'NBT data is either malformed or was not properly sanitised when parsing.'
    );
    return;
  }

  let vendorName = vendor.CustomName ? vendor.CustomName.text : '';
  tradeDisplay.name = nameEggs(vendorName);

  //console.log(`${vendorName}:`);

  if (!vendor.Offers) {
    console.log('Villager has no trades.');
    errorText.value = `This villager${
      tradeDisplay.name ? ', ' + tradeDisplay.name + ',' : ''
    } either has no trades or is not a villager.`;
    return;
  }
  if (!vendor.Offers.Recipes) {
    console.log('Villager has no trades.');
    errorText.value = `This villager${
      tradeDisplay.name ? ', ' + tradeDisplay.name + ',' : ''
    } either has no trades or is not a villager.`;
    return;
  }

  if (!tradeDisplay.name) tradeDisplay.name = 'Vendor';

  vendor.Offers.Recipes.forEach((trade, i) => {
    let firstTrade = trade.buy ? parseTradeItem(trade.buy) : '';
    let secondTrade = trade.buyB ? parseTradeItem(trade.buyB) : '';
    let ware = trade.sell ? parseTradeItem(trade.sell) : '';

    //console.log(trade);
    /*console.log(
      (firstTrade ? firstTrade : '') +
        (firstTrade && secondTrade ? ' and ' : '') +
        (secondTrade ? secondTrade : '') +
        ` for ${ware}`
    );*/

    tradeDisplay.trades.push({
      id: i + 1,
      buy1: firstTrade,
      buy2: secondTrade,
      sell: ware,
    });
  });
}

const NBTData = ref('');
</script>

<template>
  <h2>Villager Trade Reader</h2>
  <p>
    This tool takes a villager's NBT data, reads it, and produces a
    human-readable list of the villager's trades.
  </p>
  <div class="box">
    <form>
      <label for="NBTEntry">Enter vendor NBT data:</label><br />
      <textarea
        name="NBTEntry"
        id="NBTEntry"
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
    <hr v-if="tradeDisplay.trades.length > 0 || errorText" />
    <p v-if="errorText" class="errortext">{{ errorText }}</p>
    <div v-else-if="tradeDisplay.trades.length > 0">
      <h3>{{ tradeDisplay.name }} - Trades:</h3>
      <table>
        <thead>
          <tr>
            <th>Buy (1)</th>
            <th>Buy (2)</th>
            <th>Sell</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="trade in tradeDisplay.trades" :key="trade.id">
            <td>{{ trade.buy1 ? trade.buy1 : 'N/A' }}</td>
            <td>{{ trade.buy2 ? trade.buy2 : 'N/A' }}</td>
            <td>{{ trade.sell ? trade.sell : 'Nothing?!' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
#NBTEntry {
  resize: vertical;
  margin: 0.5em;
}
</style>
