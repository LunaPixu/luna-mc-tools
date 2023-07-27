import { Material, Pattern } from "./generatePacks";
import { MaterialData, PalettedPermutationAtlas, PatternData } from "./pack";

type TrimData = MaterialData | PatternData;

function strip(id: string): string {
  if (!id) return "";
  const namespaceRegex = /(.+:)?(?<name>[^:]+)/g;
  let idParts = namespaceRegex.exec(id);
  if (idParts === null || !idParts.groups?.name) return "invalid_item";
  return idParts.groups.name;
}

export class BlockAtlas implements PalettedPermutationAtlas {
  sources: [
    {
      type: "paletted_permutations";
      textures: [
        "trims/items/leggings_trim",
        "trims/items/chestplate_trim",
        "trims/items/helmet_trim",
        "trims/items/boots_trim"
      ];
      palette_key: "trims/color_palettes/trim_palette";
      permutations: {
        quartz: "trims/color_palettes/quartz";
        iron: "trims/color_palettes/iron";
        gold: "trims/color_palettes/gold";
        diamond: "trims/color_palettes/diamond";
        netherite: "trims/color_palettes/netherite";
        redstone: "trims/color_palettes/redstone";
        copper: "trims/color_palettes/copper";
        emerald: "trims/color_palettes/emerald";
        lapis: "trims/color_palettes/lapis";
        amethyst: "trims/color_palettes/amethyst";
        iron_darker: "trims/color_palettes/iron_darker";
        gold_darker: "trims/color_palettes/gold_darker";
        diamond_darker: "trims/color_palettes/diamond_darker";
        netherite_darker: "trims/color_palettes/netherite_darker";
        [key: string]: string;
      };
    }
  ];

  constructor(materialData: MaterialData[]) {
    this.sources = [
      {
        type: "paletted_permutations",
        textures: [
          "trims/items/leggings_trim",
          "trims/items/chestplate_trim",
          "trims/items/helmet_trim",
          "trims/items/boots_trim"
        ],
        palette_key: "trims/color_palettes/trim_palette",
        permutations: {
          quartz: "trims/color_palettes/quartz",
          iron: "trims/color_palettes/iron",
          gold: "trims/color_palettes/gold",
          diamond: "trims/color_palettes/diamond",
          netherite: "trims/color_palettes/netherite",
          redstone: "trims/color_palettes/redstone",
          copper: "trims/color_palettes/copper",
          emerald: "trims/color_palettes/emerald",
          lapis: "trims/color_palettes/lapis",
          amethyst: "trims/color_palettes/amethyst",
          iron_darker: "trims/color_palettes/iron_darker",
          gold_darker: "trims/color_palettes/gold_darker",
          diamond_darker: "trims/color_palettes/diamond_darker",
          netherite_darker: "trims/color_palettes/netherite_darker",
        }
      }
    ];
    materialData.forEach ((material) => {
      this.sources[0].permutations[material.asset_name] = `lunamct:trims/color_palettes/${material.asset_name}`;
    });
  }
}

export class TrimAtlas implements PalettedPermutationAtlas {
  sources: [
    {
      type: "paletted_permutations";
      textures: string[];
      palette_key: "trims/color_palettes/trim_palette";
      permutations: {
        quartz: "trims/color_palettes/quartz";
        iron: "trims/color_palettes/iron";
        gold: "trims/color_palettes/gold";
        diamond: "trims/color_palettes/diamond";
        netherite: "trims/color_palettes/netherite";
        redstone: "trims/color_palettes/redstone";
        copper: "trims/color_palettes/copper";
        emerald: "trims/color_palettes/emerald";
        lapis: "trims/color_palettes/lapis";
        amethyst: "trims/color_palettes/amethyst";
        iron_darker: "trims/color_palettes/iron_darker";
        gold_darker: "trims/color_palettes/gold_darker";
        diamond_darker: "trims/color_palettes/diamond_darker";
        netherite_darker: "trims/color_palettes/netherite_darker";
        [key: string]: string;
      };
    }
  ];

  constructor(inputData: TrimData[]) {
    this.sources = [
      {
        type: "paletted_permutations",
        textures: [
          "trims/models/armor/coast",
          "trims/models/armor/coast_leggings",
          "trims/models/armor/sentry",
          "trims/models/armor/sentry_leggings",
          "trims/models/armor/dune",
          "trims/models/armor/dune_leggings",
          "trims/models/armor/wild",
          "trims/models/armor/wild_leggings",
          "trims/models/armor/ward",
          "trims/models/armor/ward_leggings",
          "trims/models/armor/eye",
          "trims/models/armor/eye_leggings",
          "trims/models/armor/vex",
          "trims/models/armor/vex_leggings",
          "trims/models/armor/tide",
          "trims/models/armor/tide_leggings",
          "trims/models/armor/snout",
          "trims/models/armor/snout_leggings",
          "trims/models/armor/rib",
          "trims/models/armor/rib_leggings",
          "trims/models/armor/spire",
          "trims/models/armor/spire_leggings",
          "trims/models/armor/wayfinder",
          "trims/models/armor/wayfinder_leggings",
          "trims/models/armor/shaper",
          "trims/models/armor/shaper_leggings",
          "trims/models/armor/silence",
          "trims/models/armor/silence_leggings",
          "trims/models/armor/raiser",
          "trims/models/armor/raiser_leggings",
          "trims/models/armor/host",
          "trims/models/armor/host_leggings",
        ],
        palette_key: "trims/color_palettes/trim_palette",
        permutations: {
          quartz: "trims/color_palettes/quartz",
          iron: "trims/color_palettes/iron",
          gold: "trims/color_palettes/gold",
          diamond: "trims/color_palettes/diamond",
          netherite: "trims/color_palettes/netherite",
          redstone: "trims/color_palettes/redstone",
          copper: "trims/color_palettes/copper",
          emerald: "trims/color_palettes/emerald",
          lapis: "trims/color_palettes/lapis",
          amethyst: "trims/color_palettes/amethyst",
          iron_darker: "trims/color_palettes/iron_darker",
          gold_darker: "trims/color_palettes/gold_darker",
          diamond_darker: "trims/color_palettes/diamond_darker",
          netherite_darker: "trims/color_palettes/netherite_darker",
        }
      }
    ]
    inputData.forEach((data) => {
      if ("asset_name" in data) {
        this.sources[0].permutations[data.asset_name] = `lunamct:trims/color_palettes/${data.asset_name}`;
        return;
      }
      const patternName = strip(data.asset_id);
      this.sources[0].textures.push(`lunamct:trims/models/armor/${patternName}`);
      this.sources[0].textures.push(`lunamct:trims/models/armor/${patternName}_leggings`);
    });
  }
}