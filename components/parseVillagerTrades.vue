<script setup lang="ts">
import * as nbt from 'nbt-ts';
import { type Item, ItemParser } from "./itemParser";

const errorText = ref('');

const mcVersion = "1.20.1"; // TODO Make this dynamic in the future.

interface Trade {
  buy?: Item;
  buyB?: Item;
  sell?: Item;
}
interface Villager {
  Offers?: {
    Recipes?: Trade[];
  };
  CustomName?: string;
  [key: string]: any;
}
interface LiteralTrade {
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

  if (!data) { // This will no longer trigger but I'm keeping it in
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
  const invalidTradeListError = `This villager${tradeDisplay.name ? ', ' + tradeDisplay.name + ',' : ''
    } has an invalid list of trades. Please check your NBT data. If this error persists, please contact Luna Pixu.`;

  if (!vendor.Offers?.Recipes || vendor.Offers.Recipes.length === 0) {
    errorText.value = noTradeError;
    return;
  }
  if (!Array.isArray(vendor.Offers.Recipes)) {
    errorText.value = invalidTradeListError;
    return;
  }

  if (!tradeDisplay.name) tradeDisplay.name = 'Vendor';

  const itemParser = new ItemParser(mcVersion);

  vendor.Offers.Recipes.forEach((trade: Trade, i: number) => {
    let firstTrade = trade.buy ? itemParser.displayStack(trade.buy) : '';
    let secondTrade = trade.buyB ? itemParser.displayStack(trade.buyB) : '';
    let ware = trade.sell ? itemParser.displayStack(trade.sell) : '';

    tradeDisplay.trades.push({
      buy1: firstTrade,
      buy2: secondTrade,
      sell: ware,
    });
  });
}

function nameEggs(name: string): string {
  let newName = name;
  const lunaNames = ["LunaPixu", "Luna Pixu", "Luna_Pixu", "Luna-Pixu"];
  const basedNames = ["Shanoa", "Samus", "Samus Aran"];
  const lovelyNames = [
    "Amaryllis",
    "Yan Vismok",
    "Trista",
    "Trista Lundin",
    "Lala Hagoromo",
    "Amu Hinamori",
    "Usagi Tsukino",
    "Ami Mizuno",
  ];
  if (lunaNames.some((el) => el.toLowerCase() === name.toLowerCase())) newName += " (Awww... Thanks!)";
  if (basedNames.some((el) => el.toLowerCase() === name.toLowerCase())) newName += " (Based!)";
  if (lovelyNames.some((el) => el.toLowerCase() === name.toLowerCase())) newName += " (❤)";
  return newName;
}

const NBTData = ref('');

function setTradeEntryClass(entry: string): string {
  switch (entry) {
    case "Invalid Item":
      return "errortext";
    default:
      return "trade-entry";
  }
}

const tradeBox = ref<HTMLTextAreaElement | null>(null);
function getCols(): string {
  if (!tradeBox.value) return "1"; // This is definitely gonna break something, I can just feel it
  return (Math.floor(tradeBox.value.getBoundingClientRect().width / 10) - 1).toString()
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
  <div class="box" id="tradebox" ref="tradeBox">
    <form @submit.prevent="parseVillagerTrades(NBTData)">
      <label for="nbt-entry">Villager NBT Data</label>
      <HelpButton header="Enter your villager's NBT data">If you have cheats enabled in singleplayer or have op
        (or are an admin) in multiplayer, you can find a villager's NBT data through the <code>/data get entity</code>
        command. If you summoned your villager with a command block, you may also find their NBT data at the end of the
        <code>/summon</code> command.
      </HelpButton><br />
      <textarea 
        name="nbtEntry"
        id="nbt-entry"
        :cols="NBTBoxCols"
        rows="15"
        placeholder="{Offers:{Recipes:[{...}]}}"
        v-model="NBTData"
        required
      ></textarea><br />
      <button>
        Submit
      </button>
    </form>
    <hr v-if="tradeDisplay.trades.length > 0 || errorText" />
    <p v-if="errorText" class="errortext">{{ errorText }}</p>
    <template v-else-if="tradeDisplay.trades.length > 0">
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
          <tr v-for="(trade, index) in tradeDisplay.trades" :key="index">
            <td :class="setTradeEntryClass(trade.buy1)">{{ trade.buy1 ? trade.buy1 : 'N/A' }}</td>
            <td :class="setTradeEntryClass(trade.buy2)">{{ trade.buy2 ? trade.buy2 : 'N/A' }}</td>
            <td :class="setTradeEntryClass(trade.sell)">{{ trade.sell ? trade.sell : 'Nothing?!' }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>

<style scoped>
#nbt-entry {
  resize: vertical;
  margin: 0.5em 0;
  width: auto;
}
#tradebox {
  margin: 0.5em auto;
  max-width: 1000px;
}
</style>
