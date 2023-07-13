import * as nbt from "nbt-ts";

//This is just so bad... So so bad...
export interface Item {
  id: string;
  Count?: nbt.Byte;
  tag?: {
    [key: string]: any
  };
}

function pascalPhrase(phrase: string): string {
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

export class ItemParser {
  mcVersion: string;

  constructor(version: string) {
    this.mcVersion = version;
  }

  parseName(item: Item): string {
    if (!item.id) return "";
    if (item.id.match(/[^a-z0-9_:-]+/gi)) return "Invalid Item";

    let itemName: string | undefined;

    // TODO Do proper item parsing here

    if (itemName) return itemName;

    const namespaceRegex = /(.+:)?(?<name>[^:]+)/g;
    let idParts = namespaceRegex.exec(item.id);
    if (idParts === null || !idParts.groups?.name) return "Invalid Item";
    const strippedID = idParts.groups.name;

    itemName = pascalPhrase(strippedID); // Fallback in case of modded or unrecognised items
    return itemName;
  }

  displayStack(item: Item): string {
    let id = this.parseName(item);
    if (!id || id === "Invalid Item") return id;

    let stack = item.Count ? item.Count.value : 1;
    let itemName = "";
    let uniqueName = { text: "" };
    if (item.tag?.display?.Name) {
      uniqueName = JSON.parse(item.tag.display.Name);
    }
    itemName = uniqueName.text ? `${uniqueName.text} (${id})` : id;
    return (uniqueName.text && stack === 1) ? itemName : `${stack} ${itemName}`;
  }
}