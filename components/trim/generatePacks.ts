import JSZip from "jszip";
import { ItemParser } from "../itemParser";
import { PackMCMeta, Packs, PatternData, MaterialData } from "./pack";
import { TrimAtlas, BlockAtlas } from "./trimAtlases";

export class Material {
  type: "material";
  name: string;
  ingredient: string;
  color: string;
  index: number;
  separate: boolean;
  id: number;

  constructor(id: number) {
    this.type = "material";
    this.name = "";
    this.ingredient = "";
    this.color = "#000000";
    this.index = 0.55;
    this.separate = false;
    this.id = id;
  }
}
export class Pattern {
  type: "pattern";
  name: string;
  ingredient: string;
  id: number;

  constructor(id: number) {
    this.type = "pattern";
    this.name = "";
    this.ingredient = "";
    this.id = id;
  }
}
export type InputValues = Pattern | Material;

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
const existingTemplates = [
  "minecraft:netherite_upgrade_smithing_template",
  "minecraft:ward_armor_trim_smithing_template",
  "minecraft:spire_armor_trim_smithing_template",
  "minecraft:coast_armor_trim_smithing_template",
  "minecraft:eye_armor_trim_smithing_template",
  "minecraft:dune_armor_trim_smithing_template",
  "minecraft:wild_armor_trim_smithing_template",
  "minecraft:rib_armor_trim_smithing_template",
  "minecraft:tide_armor_trim_smithing_template",
  "minecraft:sentry_armor_trim_smithing_template",
  "minecraft:vex_armor_trim_smithing_template",
  "minecraft:snout_armor_trim_smithing_template",
  "minecraft:wayfinder_armor_trim_smithing_template",
  "minecraft:shaper_armor_trim_smithing_template",
  "minecraft:silence_armor_trim_smithing_template",
  "minecraft:raiser_armor_trim_smithing_template",
  "minecraft:host_armor_trim_smithing_template",
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
}

type Override = {
  model: string;
  predicate: {
    trim_type: number;
  };
};
class ArmorOverrideModel {
  parent: "minecraft:item/generated";
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

class PatternRecipe {
  type: "minecraft:smithing_trim";
  addition: {
    tag: "minecraft:trim_materials";
  };
  base: {
    tag: "minecraft:trimmable_armor";
  };
  template: {
    item: string;
  };

  constructor(templateItem: string) {
    this.type = "minecraft:smithing_trim";
    this.addition = {
      tag: "minecraft:trim_materials",
    };
    this.base = {
      tag: "minecraft:trimmable_armor",
    };
    this.template = {
      item: templateItem,
    };
  }
}

const readmeTemplate =
`This resource pack has been generated by Luna's Minecraft Tools! https://luna-minecraft-tools.vercel.app/

This resource pack is not a completed resource pack!
All the relevant .json files have been automatically generated but you still need to provide your own textures.`;

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

function checkForOverwrite(input: InputValues) {
  if (input.type === "pattern") {
    if (existingTemplates.some((el) => el === (input.ingredient.toLowerCase()) || strip(el) === (input.ingredient.toLowerCase()))) {
      throw "One of your pattern ingredients is already used in the vanilla game. Please select a different one.";
    }
  }
  if (existingTrimMaterials.some((el) => el === (input.ingredient.toLowerCase()) || strip(el) === (input.ingredient.toLowerCase()))) {
    throw "One of your material ingredients is already used in the vanilla game. Please select a different one.";
  }
}

export function generatePacks(inputValues: InputValues[], mcVersion: string, overwrite: boolean): Packs {
  if (!overwrite) {
    for (let input of inputValues) {
      try {
        checkForOverwrite(input);
      } catch (err) {
        throw err;
      }
    }
  }

  const materialValues: Material[] = [];
  const patternValues: Pattern[] = [];
  inputValues.forEach((values) => {
    if (values.type === "material") {
      materialValues.push(values);
      return;
    }
    patternValues.push(values);
  });

  let readme = readmeTemplate;
  const materialNum = materialValues.length;
  const patternNum = patternValues.length;
  if (materialNum) {
    readme +=
`\n\nFor your material${materialNum > 1 ? "s" : ""}:
${materialNum > 1 ? "Multiple 8x1 pixel palette templates" : "An 8x1 pixel palette template"} can be found in assets/lunamct/textures/trims/color_palettes/ in this pack.
Feel free to recolour, customise, or replace as you see fit.
Assuming you're not animating the palette, it's best to just recolour directly.`;
  }
  if (patternNum) {
    readme +=
`\n\nFor your pattern${patternNum > 1 ? "s" : ""}:
Please add your pattern textures to assets/lunamct/textures/trims/models/armor/ in this pack.
There will be a .txt file listing all the texture files that need to be added.`;
  }

  const dataMCMeta: PackMCMeta = {
    pack: {
      description: "Custom armor trim data generated by Luna MCT",
      pack_format: 15,
    }
  };

  const dataPack = new JSZip();
  dataPack.file("pack.mcmeta", JSON.stringify(dataMCMeta, null, "  "));

  const resourceMCMeta: PackMCMeta = {
    pack: {
      description: "Custom armor trim resources generated by Luna MCT",
      pack_format: 15,
    }
  };

  const resourcePack = new JSZip();
  resourcePack.file("pack.mcmeta", JSON.stringify(resourceMCMeta, null, "  "));
  resourcePack.file("readme.txt", readme);

  return {
    dataPack: {
      name: "lunamct-trim-data",
      zip: dataPack,
    },
    resourcePack: {
      name: "lunamct-trim-resources",
      zip: resourcePack,
    },
  };
}