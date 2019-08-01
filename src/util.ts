import {EquipmentOrder, JobAbbreviations, Roles} from './types';

const pixelWidth = require('string-pixel-width');

export const wait = async (ms: number) => new Promise((r) => setTimeout(r, ms));

export function wrapStringToLength (str: string, maxLength: number) {
  return str.split(' ').reduce((lines: string[], p) => {
    const predictedLine = `${lines[lines.length - 1]} ${p}`;
    if (!lines[lines.length - 1] || pixelWidth(predictedLine) > maxLength) {
      lines.push(p);
    } else {
      lines[lines.length - 1] = `${lines[lines.length - 1]} ${p}`;
    }
    return lines;
  }, []).map((l) => padLineToPixelWidth(l, maxLength)).join('\n');
}

export function padLineToPixelWidth (str: string, width: number) {
  const EMPTY = '\u200B';
  let tmp = str;
  while (pixelWidth(tmp) < width) {
    tmp += EMPTY;
  }
  return tmp;
}

export function reorderGear (data: Record<string, string>) {
  return Object.entries(EquipmentOrder)
    .reduce((ob, [k]) => isNaN(Number(k)) ? {...ob, [k]: data[k] || ' '} : ob, {});
}

export const roleJobMap = {
  [Roles.HEALER]: [
    JobAbbreviations.WHM,
    JobAbbreviations.SCH,
    JobAbbreviations.AST
  ],
  [Roles.TANK]: [
    JobAbbreviations.PLD,
    JobAbbreviations.WAR,
    JobAbbreviations.DRK,
    JobAbbreviations.GNB,
  ],
  [Roles.DPS]: [
    JobAbbreviations.SMN,
    JobAbbreviations.BRD,
    JobAbbreviations.DRG,
    JobAbbreviations.MNK,
    JobAbbreviations.NIN,
    JobAbbreviations.BLM,
    JobAbbreviations.MCH,
    JobAbbreviations.SAM,
    JobAbbreviations.RDM,
    JobAbbreviations.DNC,
  ]
}

export const jobRoleMap = {
  [JobAbbreviations.WHM]: Roles.HEALER,
  [JobAbbreviations.SCH]: Roles.HEALER,
  [JobAbbreviations.AST]: Roles.HEALER,
  [JobAbbreviations.PLD]: Roles.TANK,
  [JobAbbreviations.WAR]: Roles.TANK,
  [JobAbbreviations.DRK]: Roles.TANK,
  [JobAbbreviations.GNB]: Roles.TANK,
  [JobAbbreviations.SMN]: Roles.DPS,
  [JobAbbreviations.BRD]: Roles.DPS,
  [JobAbbreviations.DRG]: Roles.DPS,
  [JobAbbreviations.MNK]: Roles.DPS,
  [JobAbbreviations.NIN]: Roles.DPS,
  [JobAbbreviations.BLM]: Roles.DPS,
  [JobAbbreviations.MCH]: Roles.DPS,
  [JobAbbreviations.SAM]: Roles.DPS,
  [JobAbbreviations.RDM]: Roles.DPS,
  [JobAbbreviations.DNC]: Roles.DPS,
}