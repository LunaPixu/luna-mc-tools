import JSZip from "jszip";

export interface Pack {
  name: string;
  zip: JSZip;
}

export type Packs = {
  dataPack: Pack;
  resourcePack: Pack;
};

export interface PackMCMeta {
  pack: {
    description: string,
    pack_format: number,
  }
}