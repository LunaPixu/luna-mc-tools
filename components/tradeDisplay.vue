<script setup lang="ts">
import { LiteralTrade, TradeDisplay } from './parseVillagerTrades.vue';
const props = defineProps({
  tradeDisplay: { type: Object as PropType<TradeDisplay>, required: true },
});

const inlineTrades: ComputedRef<string[]> = computed(() => {
  const trades: string[] = [];
  props.tradeDisplay.trades.forEach((tradeData: LiteralTrade) => {
    let tradeText = "";
    if (tradeData.buy1 || tradeData.buy2) {
      tradeText += tradeData.buy1;
      if (tradeData.buy1 && tradeData.buy2) tradeText += " + ";
      tradeText += tradeData.buy2;
    } else {
      tradeText += "Nothing";
    }
    tradeText += " => ";
    if (tradeData.sell)
    {
      tradeText += tradeData.sell;
    } else {
      tradeText += "Nothing?!";
    }
    trades.push(tradeText);
  })
  return trades;
});

const displayAsText: Ref<boolean> = ref(false);

function setTradeEntryClass(entry: string): string {
  switch (entry) {
    case "Invalid Item":
      return "errortext";
    default:
      return "trade-entry";
  }
}
</script>

<template>
  <div class="flex-options">
    <button class="wide-flex-button" type="button" @click="displayAsText=false">Table</button>
    <button class="wide-flex-button" type="button" @click="displayAsText=true">Text</button>
  </div>
  <h3>{{ tradeDisplay.name }} - Trades:</h3>
  <template v-if="displayAsText">
    <ul>
      <li v-for="(trade, index) in inlineTrades" :key="index">{{ trade }}</li>
    </ul>
  </template>
  <table id="tradetable" v-else>
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

<style scoped>
#tradetable {
  table-layout: fixed;
}
</style>