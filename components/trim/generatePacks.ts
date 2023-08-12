import JSZip from "jszip";
import { ItemParser } from "../itemParser";
import { PackMCMeta, Packs, PatternData, MaterialData } from "./pack";
import { TrimAtlas, BlockAtlas } from "./trimAtlases";

class InputEntry {
  name: string;
  show: boolean;
  id: number;

  constructor (id: number) {
    this.name = "";
    this.show = true;
    this.id = id;
  }
}
export class Material extends InputEntry {
  type: "material";
  ingredient: string;
  color: string;
  index: number;
  separate: boolean;

  constructor(id: number) {
    super(id);
    this.type = "material";
    this.ingredient = "";
    this.color = "#ffffff";
    this.index = 0.55;
    this.separate = false;
  }
}
export class Pattern extends InputEntry {
  type: "pattern";
  ingredient: string;

  constructor(id: number) {
    super(id);
    this.type = "pattern";
    this.ingredient = "";
  }
}
export type InputValues = Pattern | Material;

class MaterialDataObj implements MaterialData {
  asset_name: string;
  description: { color: string; translate: string; };
  ingredient: string;
  item_model_index: number;

  constructor(material: Material) {
    this.asset_name = material.separate ? collapse(material.name) : strip(material.ingredient.toLowerCase());
    this.description = {
      color: material.color,
      translate: `trim_material.lunamct.${this.asset_name}`,
    };
    this.ingredient = material.ingredient;
    this.item_model_index = material.index;
  }
}
class PatternDataObj implements PatternData {
  asset_id: string;
  description: { translate: string; };
  template_item: string;

  constructor(pattern: Pattern) {
    this.asset_id = collapse(pattern.name);
    this.description = { translate: `trim_pattern.lunamct.${this.asset_id}` };
    this.template_item = pattern.ingredient;
  }
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

interface Override {
  model: string;
  predicate: { trim_type: number };
}
class CustomOverride implements Override {
  model: string;
  predicate: { trim_type: number };

  constructor(armorMaterial: string, armorPiece: string, material: MaterialData) {
    this.model = `lunamct:item/${armorMaterial}_${armorPiece}_${material.asset_name}_trim`;
    this.predicate = { trim_type: material.item_model_index };
  }
}
class ArmorOverrideModel {
  parent: "minecraft:item/generated";
  overrides: Override[];
  textures: {
    layer0: string;
    layer1?: string;
  };

  constructor(armorMaterial: string, armorPiece: string, materialData: MaterialData[]) {
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
    materialData.forEach((material) => {
      this.overrides.push(new CustomOverride(armorMaterial, armorPiece, material));
    });
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

class MaterialTag {
  values: string[];

  constructor (materials: MaterialData[]) {
    this.values = [];
    materials.forEach((material) => {
      this.values.push(material.ingredient)
    });
  }
}
class PatternTag {
  values: string[];

  constructor (patterns: PatternData[]) {
    this.values = [];
    patterns.forEach((pattern) => {
      this.values.push(pattern.template_item)
    });
  }
}

class MaterialTranslations {
  [key: string]: string;

  constructor(materials: MaterialData[], materialValues: Material[], parser: ItemParser) {
    materials.forEach((material, i) => {
      this[material.description.translate] = materialValues[i].separate ? materialValues[i].name : parser.parseName({ id: materialValues[i].ingredient });
    });
  }
}
class PatternTranslations {
  [key: string]: string;

  constructor (patterns: PatternData[], patternValues: Pattern[]) {
    patterns.forEach((pattern, i) => {
      this[pattern.description.translate] = `${patternValues[i].name} Armor Trim`;
    });
  }
}

function addTrimModelsToZip(zip: JSZip, armMat: string, armPiece: string, materials: MaterialData[]) {
  materials.forEach((material) => {
    zip.file(`assets/lunamct/models/item/${armMat}_${armPiece}_${material.asset_name}_trim.json`, JSON.stringify(new MaterialModel(armMat, armPiece, material.asset_name), null, "  "));
  });
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

function checkForOverwrite(input: InputValues): void {
  if (input.type === "pattern") {
    if (existingTemplates.some((el) => el === (input.ingredient.toLowerCase()) || strip(el) === (input.ingredient.toLowerCase()))) {
      throw "One of your pattern ingredients is already used in the vanilla game. Please select a different one.";
    }
  }
  if (existingTrimMaterials.some((el) => el === (input.ingredient.toLowerCase()) || strip(el) === (input.ingredient.toLowerCase()))) {
    throw "One of your material ingredients is already used in the vanilla game. Please select a different one.";
  }
}

function checkForDupeMaterialProps(materials: Material[]): string {
  const ingredientValidator: Set<string> = new Set();
  const indexValidator: Set<number> = new Set();
  const materialNum = materials.length;

  for (let i = 0; i < materialNum; i++) {
    ingredientValidator.add(materials[i].ingredient);
    indexValidator.add(materials[i].index);
    if (ingredientValidator.size !== i+1) return "ingredient";
    if (indexValidator.size !== i+1) return "index";
  };
  
  return "";
}
function checkForDupePatternProps(patterns: Pattern[]): string {
  const nameValidator: Set<string> = new Set();
  const ingredientValidator: Set<string> = new Set();
  const patternNum = patterns.length;

  for (let i = 0; i < patternNum; i++) {
    nameValidator.add(patterns[i].name);
    ingredientValidator.add(patterns[i].ingredient); 
    if (nameValidator.size !== i+1) return "name";
    if (ingredientValidator.size !== i+1) return "ingredient";
  };

  return "";
}

export function generatePacks(inputValues: InputValues[], mcVersion: string, overwrite: boolean): Packs {
  if (!inputValues.length) throw "No materials or patterns have been provided... somehow. Please contact Luna Pixu if you see this message.";

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

  const dupeMaterial = checkForDupeMaterialProps(materialValues);
  if (dupeMaterial) throw `More than one of your trim materials has the same ${dupeMaterial}. Please double check your trim material values.`;
  const dupePattern = checkForDupePatternProps(patternValues);
  if (dupePattern) throw `More than one of your trim patterns has the same ${dupePattern}. Please double check your trim pattern values.`;

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

  const nameValidator: Set<string> = new Set();
  const materialDataObjs: Array<MaterialData> = [];
  materialValues.forEach((material) => {
    const output = new MaterialDataObj(material);
    materialDataObjs.push(output);
    nameValidator.add(output.asset_name);
    if (materialDataObjs.length !== nameValidator.size) {
      throw `More than one of your trim materials has the same name.
      This may happen if a material's custom name ends up matching the name of a non-separated material's ingredient.
      Please double check your trim material values.`;
    }
  });

  const patternDataObjs: Array<PatternData> = [];
  patternValues.forEach((pattern) => {
    patternDataObjs.push(new PatternDataObj(pattern));
  });

  const dataMCMeta: PackMCMeta = {
    pack: {
      description: "Custom armor trim data generated by Luna MCT",
      pack_format: 15,
    }
  };

  const itemParser = new ItemParser(mcVersion);

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
  
  if (materialDataObjs.length > 0) {
    const templatePalette = "iVBORw0KGgoAAAANSUhEUgAAAAgAAAABCAMAAADU3h9xAAAABGdBTUEAALGOfPtRkwAAABhQTFRF6+vrlZWVg4ODYGBgUFBQMjIyISEhFxcX911EVwAAABFJREFUCJljYGBkYmZhZWMHAABdAB2tV7ZvAAAAAElFTkSuQmCC";

    materialDataObjs.forEach((material) => {
      resourcePack.file(`assets/lunamct/textures/trims/color_palettes/${material.asset_name}.png`, templatePalette, { base64: true });
      resourcePack.file(`assets/lunamct/models/item/turtle_helmet_${material.asset_name}_trim.json`, JSON.stringify(new MaterialModel("turtle", "helmet", material.asset_name), null, "  "));
    });

    resourcePack.file(`assets/minecraft/atlases/blocks.json`, JSON.stringify(new BlockAtlas(materialDataObjs), null, "  "));
    
    armorMaterials.forEach((armMat) => {
      armorPieces.forEach((armPiece) => {
        resourcePack.file(`assets/minecraft/models/item/${armMat}_${armPiece}.json`, JSON.stringify(new ArmorOverrideModel(armMat, armPiece, materialDataObjs), null, "  "));
        addTrimModelsToZip(resourcePack, armMat, armPiece, materialDataObjs);
      })
    });
    resourcePack.file(`assets/minecraft/models/item/turtle_helmet.json`, JSON.stringify(new ArmorOverrideModel("turtle", "helmet", materialDataObjs), null, "  "));
  }

  const materialTranslations = new MaterialTranslations(materialDataObjs, materialValues, itemParser);
  const patternTranslations = new PatternTranslations(patternDataObjs, patternValues);
  resourcePack.file("assets/lunamct/lang/en_us.json", JSON.stringify({ ...patternTranslations, ...materialTranslations }, null, "  "));
  resourcePack.file(`assets/minecraft/atlases/armor_trims.json`, JSON.stringify(new TrimAtlas([...materialDataObjs, ...patternDataObjs]), null, "  "));

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