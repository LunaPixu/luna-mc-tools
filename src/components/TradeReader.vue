<script setup>
import { ref } from 'vue';
import { reactive } from 'vue';
import { parse } from 'nbt-ts';

const errorText = ref('');

function capitalisePhrase(phrase) {
  return phrase
    .match(/[a-z0-9]+/gi)
    .map((word) => {
      return word
        .split('')
        .map((l, i) => (i === 0 ? l.toUpperCase() : l.toLowerCase()))
        .join('');
    })
    .join(' ');
}

function parseTradeItem(item) {
  let itemName = '';
  let id = item.id;
  id = id.match(/(?<=:).*/gi)[0];
  id = capitalisePhrase(id);

  if (item.tag) {
    if (item.tag.display) {
      if (item.tag.display.Name) {
        itemName = `${JSON.parse(item.tag.display.Name).text} (${id})`;
        return item.Count.value === 1
          ? itemName
          : `${item.Count.value} ${itemName}`;
      }
    }
  }

  itemName = id;
  return `${item.Count.value} ${itemName}`;
}

function nameEggs(name) {
  let newName = name;
  let lunaNames = ['LunaPixu', 'Luna Pixu', 'Luna_Pixu', 'Luna-Pixu'];
  let basedNames = ['Shanoa', 'Samus'];
  let lovelyNames = [
    'Amaryllis',
    'Yan Vismok',
    'Trista',
    'Trista Lundin',
    'Lala Hagoromo',
  ];
  if (lunaNames.some((el) => el === name)) newName += ' (Awww... Thanks!)';
  if (basedNames.some((el) => el === name)) newName += ' (Based!)';
  if (lovelyNames.some((el) => el === name)) newName += ' (❤)';
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

  let vendor;
  try {
    vendor = parse(data);
  } catch {
    errorText.value =
      'NBT data is either invalid or malformed, or an unexpected error occured during parsing. Please check your NBT data. If it continues to fail, please contact Luna Pixu.';
    return;
  }

  let vendorName = vendor.CustomName ? JSON.parse(vendor.CustomName).text : '';
  tradeDisplay.name = nameEggs(vendorName);

  //console.log(`${vendorName}:`);

  try {
    if (!vendor.Offers.Recipes || vendor.Offers.Recipes.length === 0) {
      console.log('Villager has no trades.');
      errorText.value = `This villager${
        tradeDisplay.name ? ', ' + tradeDisplay.name + ',' : ''
      } either has no trades or is not a villager.`;
      return;
    }
  } catch {
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
  <p class="notice">
    <i
      >Note: Trade Reader was made with Minecraft Java&nbspEdition 1.18.2 in
      mind. I cannot guarantee this tool will properly function with older or
      newer versions, nor do I know if it will work for Bedrock.</i
    >
  </p>
  <div class="box">
    <form>
      <label for="NBTEntry">Enter villager NBT data:</label><br />
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
