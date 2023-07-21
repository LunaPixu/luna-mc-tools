import JSZip from "jszip";
import { ItemParser } from "../itemParser";
import { PackMCMeta, Packs } from "./pack";

export interface MaterialValues {
  name?: string;
  ingredient: string;
  color: string;
  index: number;
}

interface MaterialData {
  asset_name: string;
  description: {
    color: string;
    translate?: string;
  };
  ingredient: string;
  item_model_index: number;
}

function collapse(name: string): string {
  if (!name) return "";
  let out = name.replace(/ /gm, "_");
  return out.replace(/[^a-z0-9_-]/gmi, "").toLowerCase();
}

function strip(id: string): string {
  if (!id) return "";
  const namespaceRegex = /(.+:)?(?<name>[^:]+)/g;
  let idParts = namespaceRegex.exec(id);
  if (idParts === null || !idParts.groups?.name) return "invalid_item";
  return idParts.groups.name;
}

const existingTrimMaterials = [
  "minecraft:diamond",
  "minecraft:iron_ingot",
  "minecraft:netherite_ingot",
  "minecraft:gold_ingot",
  "minecraft:redstone",
  "minecraft:lapis_lazuli",
  "minecraft:emerald",
  "minecraft:amethyst_shard",
  "minecraft:copper_ingot",
  "minecraft:quartz",
];

const armorPieces = [
  "boots",
  "helmet",
  "chestplate",
  "leggings",
];
const armorMaterials = [
  "chainmail",
  "diamond",
  "golden",
  "leather",
  "iron",
  "netherite",
];

class MaterialModel {
  parent: string;
  textures: {
    layer0: string;
    layer1: string;
    layer2?: string;
  };

  constructor(armorMaterial: string, armorPiece: string, trimMaterial: string) {
    this.parent = "minecraft:item/generated";
    this.textures = {
      layer0: `minecraft:item/${armorMaterial}_${armorPiece}`,
      layer1: armorMaterial === "leather" ? `minecraft:item/leather_${armorPiece}_overlay` : `minecraft:trims/items/${armorPiece}_trim_${trimMaterial}`,
    };
    if (armorMaterial === "leather") this.textures.layer2 = `minecraft:trims/items/${armorPiece}_trim_${trimMaterial}`;
  }
};

type Override = {
  model: string;
  predicate: {
    trim_type: number;
  };
};
class ArmorOverrideModel {
  parent: string;
  overrides: Override[];
  textures: {
    layer0: string;
    layer1?: string;
  };

  constructor(armorMaterial: string, armorPiece: string, materialData: MaterialData) {
    this.parent = "minecraft:item/generated";
    this.overrides = [
      {
        model: `minecraft:item/${armorMaterial}_${armorPiece}_quartz_trim`,
        predicate: {
          trim_type: 0.1
        }
      },
      {
        model: `minecraft:item/${armorMaterial}_${armorPiece}_iron_trim`,
        predicate: {
          trim_type: 0.2
        }
      },
      {
        model: `minecraft:item/${armorMaterial}_${armorPiece}_netherite_trim`,
        predicate: {
          trim_type: 0.3
        }
      },
      {
        model: `minecraft:item/${armorMaterial}_${armorPiece}_redstone_trim`,
        predicate: {
          trim_type: 0.4
        }
      },
      {
        model: `minecraft:item/${armorMaterial}_${armorPiece}_copper_trim`,
        predicate: {
          trim_type: 0.5
        }
      },
      {
        model: `minecraft:item/${armorMaterial}_${armorPiece}_gold_trim`,
        predicate: {
          trim_type: 0.6
        }
      },
      {
        model: `minecraft:item/${armorMaterial}_${armorPiece}_emerald_trim`,
        predicate: {
          trim_type: 0.7
        }
      },
      {
        model: `minecraft:item/${armorMaterial}_${armorPiece}_diamond_trim`,
        predicate: {
          trim_type: 0.8
        }
      },
      {
        model: `minecraft:item/${armorMaterial}_${armorPiece}_lapis_trim`,
        predicate: {
          trim_type: 0.9
        }
      },
      {
        model: `minecraft:item/${armorMaterial}_${armorPiece}_amethyst_trim`,
        predicate: {
          trim_type: 1.0
        }
      },
    ];
    this.overrides.push(
      {
        model: `lunamct:item/${armorMaterial}_${armorPiece}_${materialData.asset_name}_trim`,
        predicate: {
          trim_type: materialData.item_model_index
        }
      }
    );
    this.textures = {
      layer0: `minecraft:item/${armorMaterial}_${armorPiece}`
    };
    if (armorMaterial === "leather") {
      this.textures.layer1 = `minecraft:item/leather_${armorPiece}_overlay`;
    }
  }
}

class BlockAtlas {
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

  constructor(trimMaterial: string) {
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
    this.sources[0].permutations[trimMaterial] = `lunamct:trims/color_palettes/${trimMaterial}`;
  }
};

class TrimAtlas {
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

  constructor(trimMaterial: string) {
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
    ];
    this.sources[0].permutations[trimMaterial] = `lunamct:trims/color_palettes/${trimMaterial}`;
  }
}

const readme =
  `This resource pack has been generated by Luna's Minecraft Tools! https://luna-minecraft-tools.vercel.app/

This resource pack is not a completed resource pack!
All the relevant .json files have been automatically generated but you still need to provide your own textures.
A template palette can be found in assets/lunamct/textures/color_palettes/ in this pack.
Feel free to recolour, customise, or replace it as you see fit.`;

export function generateMaterial(values: MaterialValues, mcVersion: string): Packs {
  if (!values.ingredient) { // This should never trigger but it's staying in
    throw "No ingredient was provided.";
  }

  if (existingTrimMaterials.some((el) => el === (values.ingredient.toLowerCase()) || strip(el) === (values.ingredient.toLowerCase()))) {
    throw "Chosen ingredient is already used in vanilla. Please select a different one.";
  }

  const itemParser = new ItemParser(mcVersion);

  const materialData: MaterialData = {
    asset_name: "",
    description: {
      color: values.color,
    },
    ingredient: values.ingredient,
    item_model_index: values.index ? values.index : 0.55, // This defaulting behaviour shouldn't happen but I'm keeping it in
  };

  const materialName = values.name ? values.name : itemParser.parseName({ id: values.ingredient.toLowerCase() });
  materialData.asset_name = values.name ? collapse(values.name) : strip(values.ingredient.toLowerCase());
  materialData.description.translate = `trim_material.lunamct.${materialData.asset_name}`;

  const dataMCMeta: PackMCMeta = {
    pack: {
      description: `${materialName} trim material generated by Luna MCT`,
      pack_format: 15,
    }
  };

  const dataPack = new JSZip();
  dataPack.file("pack.mcmeta", JSON.stringify(dataMCMeta, null, "  "));
  dataPack.file(`data/lunamct/trim_material/${materialData.asset_name}.json`, JSON.stringify(materialData, null, "  "));
  dataPack.file("data/minecraft/tags/items/trim_materials.json", JSON.stringify({values: [materialData.ingredient]}, null, "  "));

  const resourceMCMeta: PackMCMeta = {
    pack: {
      description: `${materialName} trim material generated by Luna MCT`,
      pack_format: 15,
    }
  };

  const resourcePack = new JSZip();
  resourcePack.file("pack.mcmeta", JSON.stringify(resourceMCMeta, null, "  "));
  resourcePack.file("README.txt", readme);
  const templateTrim = "iVBORw0KGgoAAAANSUhEUgAAAAgAAAABCAMAAADU3h9xAAAABGdBTUEAALGOfPtRkwAAABhQTFRF6+vrlZWVg4ODYGBgUFBQMjIyISEhFxcX911EVwAAABFJREFUCJljYGBkYmZhZWMHAABdAB2tV7ZvAAAAAElFTkSuQmCC";
  resourcePack.file(`assets/lunamct/lang/en_us.json`, JSON.stringify({[materialData.description.translate]: materialName}, null, "  "));
  
  resourcePack.file(`assets/lunamct/textures/trims/color_palettes/${materialData.asset_name}.png`, templateTrim, { base64: true });

  resourcePack.file(`assets/minecraft/atlases/armor_trims.json`, JSON.stringify(new TrimAtlas(materialData.asset_name), null, "  "));
  resourcePack.file(`assets/minecraft/atlases/blocks.json`, JSON.stringify(new BlockAtlas(materialData.asset_name), null, "  "));

  armorMaterials.forEach((armMat) => {
    armorPieces.forEach((armPiece) => {
      resourcePack.file(`assets/minecraft/models/item/${armMat}_${armPiece}.json`, JSON.stringify(new ArmorOverrideModel(armMat, armPiece, materialData), null, "  "));
      resourcePack.file(`assets/lunamct/models/item/${armMat}_${armPiece}_${materialData.asset_name}_trim.json`, JSON.stringify(new MaterialModel(armMat, armPiece, materialData.asset_name), null, "  "));
    })
  });
  resourcePack.file(`assets/minecraft/models/item/turtle_helmet.json`, JSON.stringify(new ArmorOverrideModel("turtle", "helmet", materialData), null, "  "));
  resourcePack.file(`assets/lunamct/models/item/turtle_helmet_${materialData.asset_name}_trim.json`, JSON.stringify(new MaterialModel("turtle", "helmet", materialData.asset_name), null, "  "));

  return {
    dataPack: {
      name: materialData.asset_name + "_material-data",
      zip: dataPack,
    },
    resourcePack: {
      name: materialData.asset_name + "_material-resources",
      zip: resourcePack,
    },
  };
}