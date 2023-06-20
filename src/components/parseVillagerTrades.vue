<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { reactive } from 'vue';
import * as nbt from 'nbt-ts';

const errorText = ref('');

//Still not fond of this... This is going as soon as it can.
interface Item {
  id: string
  Count?: nbt.Byte
  tag?: nbt.TagObject
};

function capitalisePhrase(phrase: string): string {
  if (!phrase) return "";
  let words = phrase.match(/[a-z0-9]+/gi);
  if (words === null) return "";
  return words.map((word) => {
    return word
      .split('')
      .map((l, i) => (i === 0 ? l.toUpperCase() : l.toLowerCase()))
      .join('');
  }).join(' ');
};

function parseTradeItem(item: Item): string {
  if (!item.id) {
    return "";
  }
  let itemName = '';
  let id = item.id;
  let strippedID = id.match(/(?<=:).*/gi);
  if (strippedID === null) {
    return "Invalid Item";
  }
  id = strippedID[0];
  id = capitalisePhrase(id);

  let stack = item.Count ? item.Count.value : 1;

  if (item.tag && item.tag.display && item.tag.display.Name) {
    itemName = `${JSON.parse(item.tag.display.Name).text} (${id})`;
    return stack === 1
      ? itemName
      : `${stack} ${itemName}`;
  }

  itemName = id;
  return `${stack} ${itemName}`;
};

function nameEggs(name: string): string {
  let newName = name;
  const lunaNames = ['LunaPixu', 'Luna Pixu', 'Luna_Pixu', 'Luna-Pixu'];
  const basedNames = ['Shanoa', 'Samus'];
  const lovelyNames = [
    'Amaryllis',
    'Yan Vismok',
    'Trista',
    'Trista Lundin',
    'Lala Hagoromo',
    "Amu Hinamori",
  ];
  if (lunaNames.some((el) => el === name)) newName += ' (Awww... Thanks!)';
  if (basedNames.some((el) => el === name)) newName += ' (Based!)';
  if (lovelyNames.some((el) => el === name)) newName += ' (❤)';
  return newName;
};

interface Trade {
  buy?: Item
  buyB?: Item
  sell?: Item
};
interface LiteralTrade {
  id: number
  buy1: string
  buy2: string
  sell: string
};
interface TradeDisplay {
  name: string
  trades: LiteralTrade[]
};

const tradeDisplay: TradeDisplay = reactive({
  name: '',
  trades: [],
});

function parseVillagerTrades(data: string): void {
  tradeDisplay.name = '';
  tradeDisplay.trades = [];
  errorText.value = '';

  if (!data) {
    errorText.value = 'No NBT data provided...';
    return;
  }
  if (data[0] != '{' || data.charAt(data.length - 1) != '}') {
    errorText.value =
      "Invalid NBT data provided. NBT data must be contained within braces '{ }'.";
    return;
  }

  let vendor: nbt.TagObject;
  try {
    vendor = nbt.parse(data);
  } catch {
    errorText.value =
      'NBT data is either invalid or malformed, or an unexpected error occured during parsing. Please check your NBT data. If it continues to fail, please contact Luna Pixu.';
    return;
  }

  let vendorName: string = vendor.CustomName ? JSON.parse(vendor.CustomName).text : '';
  tradeDisplay.name = nameEggs(vendorName);

  //console.log(`${vendorName}:`);

  const noTradeError = `This villager${tradeDisplay.name ? ', ' + tradeDisplay.name + ',' : ''
    } either has no trades or is not a villager.`;

  if (!vendor.Offers || !vendor.Offers.Recipes || vendor.Offers.Recipes.length === 0) {
    console.log('Villager has no trades.');
    errorText.value = noTradeError;
    return;
  }

  if (!tradeDisplay.name) tradeDisplay.name = 'Vendor';

  vendor.Offers.Recipes.forEach((trade: Trade, i: number) => {
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

let resizeTimer = 0;
function resizeEntryBox(): void {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    let NBTBox = document.getElementById('NBTEntry');
    if (NBTBox === null) return;
    NBTBox.setAttribute('cols', Math.min(50, window.innerWidth / 11 - 1).toString())
  }, 200);
}

onMounted(() => {
  resizeEntryBox();
  window.addEventListener("resize", resizeEntryBox);
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeEntryBox);
});
</script>

<template>
  <div class="box" id="tradebox">
    <form>
      <label for="NBTEntry">Enter villager NBT data:</label><br />
      <textarea name="NBTEntry" id="NBTEntry" cols="50" rows="10" placeholder="{Offers:{Recipes:[{...}]}}"
        v-model="NBTData"></textarea><br />
      <button type="button" @click="parseVillagerTrades(NBTData)">
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
  width: auto;
}
#tradebox {
  margin: 0.5em auto;
  max-width: 1000px;
}
</style>
