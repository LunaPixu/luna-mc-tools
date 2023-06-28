<script setup lang="ts">
import * as nbt from 'nbt-ts';

const errorText = ref('');

//This is just so bad... So so bad...
interface Item {
  id: string;
  Count?: nbt.Byte;
  tag?: {
    [key: string]: any
  };
}

function capitalisePhrase(phrase: string): string {
  if (!phrase) return '';
  let words = phrase.match(/[a-z0-9]+/gi);
  if (words === null) return '';
  return words
    .map((word) => {
      return word
        .split('')
        .map((l, i) => (i === 0 ? l.toUpperCase() : l.toLowerCase()))
        .join('');
    })
    .join(' ');
}

function parseTradeItem(item: Item): string {
  if (!item.id) {
    return '';
  }
  let itemName = '';
  let id = item.id;
  let strippedID = id.match(/(?<=:).*/gi);
  if (strippedID === null) {
    return 'Invalid Item';
  }
  id = strippedID[0];
  id = capitalisePhrase(id);

  let stack = item.Count ? item.Count.value : 1;

  if (item.tag?.display?.Name) {
    itemName = `${JSON.parse(item.tag.display.Name).text} (${id})`;
    return stack === 1 ? itemName : `${stack} ${itemName}`;
  }

  itemName = id;
  return `${stack} ${itemName}`;
}

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
    'Amu Hinamori',
    "Usagi Tsukino",
    "Ami Mizuno",
  ];
  if (lunaNames.some((el) => el === name)) newName += ' (Awww... Thanks!)';
  if (basedNames.some((el) => el === name)) newName += ' (Based!)';
  if (lovelyNames.some((el) => el === name)) newName += ' (❤)';
  return newName;
}

interface Trade {
  buy?: Item;
  buyB?: Item;
  sell?: Item;
}
interface Villager {
  Offers?: {
    Recipes: Trade[];
  };
  CustomName?: string;
  [key: string]: any;
}
interface LiteralTrade {
  id: number;
  buy1: string;
  buy2: string;
  sell: string;
}
interface TradeDisplay {
  name: string;
  trades: LiteralTrade[];
}

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

  let vendor: Villager;
  try {
    vendor = nbt.parse(data) as Villager;
  } catch {
    errorText.value =
      'NBT data is either invalid or malformed, or an unexpected error occured during parsing. Please check your NBT data. If it continues to fail, please contact Luna Pixu.';
    return;
  }

  let vendorName: string = vendor.CustomName
    ? JSON.parse(vendor.CustomName).text
    : '';
  tradeDisplay.name = nameEggs(vendorName);

  const noTradeError = `This villager${tradeDisplay.name ? ', ' + tradeDisplay.name + ',' : ''
    } either has no trades or is not a villager.`;

  if (!vendor.Offers?.Recipes || vendor.Offers.Recipes.length === 0) {
    errorText.value = noTradeError;
    return;
  }

  if (!tradeDisplay.name) tradeDisplay.name = 'Vendor';

  vendor.Offers.Recipes.forEach((trade: Trade, i: number) => {
    let firstTrade = trade.buy ? parseTradeItem(trade.buy) : '';
    let secondTrade = trade.buyB ? parseTradeItem(trade.buyB) : '';
    let ware = trade.sell ? parseTradeItem(trade.sell) : '';

    tradeDisplay.trades.push({
      id: i + 1,
      buy1: firstTrade,
      buy2: secondTrade,
      sell: ware,
    });
  });
}

const NBTData = ref('');

function getCols(): string {
  const tradeBox = document.getElementById("tradebox");
  if (!tradeBox) return "1"; // This is definitely gonna break something, I can just feel it
  return (Math.floor(tradeBox.getBoundingClientRect().width / 10) - 1).toString()
};

const NBTBoxCols = ref(getCols());
let resizeTimer = 0;
function resizeEntryBox(): void {
  clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout((): void => {
    NBTBoxCols.value = getCols();
  }, 300);
}

onMounted((): void => {
  NBTBoxCols.value = getCols();
  window.addEventListener("resize", resizeEntryBox);
});
onUnmounted((): void => {
  window.removeEventListener("resize", resizeEntryBox);
})
</script>

<template>
  <div class="box" id="tradebox">
    <form>
      <label for="NBTEntry">Enter villager NBT data:</label><br />
      <textarea name="NBTEntry" id="NBTEntry" :cols="NBTBoxCols" rows="15" placeholder="{Offers:{Recipes:[{...}]}}"
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
