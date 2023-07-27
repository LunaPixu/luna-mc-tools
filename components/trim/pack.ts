import JSZip from "jszip";

export interface Pack {
  name: string;
  zip: JSZip;
}

export type Packs = {
  dataPack: Pack;
  resourcePack: Pack;
};

export interface MaterialData {
  asset_name: string;
  description: {
    color: string;
    translate: string;
  };
  ingredient: string;
  item_model_index: number;
}
export interface PatternData {
  asset_id: string;
  description: {
    translate: string;
  };
  template_item: string;
}

export interface PalettedPermutationAtlas {
  sources: [
    {
      type: "paletted_permutations";
      textures: string[];
      palette_key: string;
      permutations: {
        [key: string]: string;
      }
    }
  ];
}

export interface PackMCMeta {
  pack: {
    description: string,
    pack_format: number,
  }
}