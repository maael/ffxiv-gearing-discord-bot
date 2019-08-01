export interface XIVAPI_Character {
  ID: string,
  Name: string,
  Server: string,
  Avatar: string
};

export interface XIVAPI_CharacterDetails {
  Character: {
    GearSet: {
      Gear: Record<string, {Item: {ID: string}}>
    }
    ActiveClassJob: {
      Job: {
        Abbreviation: string;
      }
    }
  }
  Info: {
    Character: {
      Updated: number;
      State: number;
    }
  }
};

export interface XIVAPI_ItemDetails {
  ID: string,
  LevelItem: number,
  Name: string,
  Icon: string
};

export enum EquipmentOrder {
  MainHand,
  Empty,
  Head,
  Earrings,
  Body,
  Necklace,
  Hands,
  Bracelets,
  Waist,
  Ring1,
  Legs,
  Ring2,
  Feet,
  SoulCrystal
}

export enum RoleColours {
  'HEALER' = 'GREEN',
  'TANK' = 'BLUE',
  'DPS' = 'RED',
  'default' = 'GREY'
}

export enum JobAbbreviations {
  'PLD' = 'PLD',
  'WAR' = 'WAR',
  'DRK' = 'DRK',
  'GNB' = 'GNB',
  'SCH' = 'SCH',
  'AST' = 'AST',
  'WHM' = 'WHM',
  'SMN' = 'SMN',
  'BRD' = 'BRD',
  'DRG' = 'DRG',
  'MNK' = 'MNK',
  'NIN' = 'NIN',
  'BLM' = 'BLM',
  'MCH' = 'MCH',
  'SAM' = 'SAM',
  'RDM' = 'RDM',
  'DNC' = 'DNC',
}

export enum Roles {
  'HEALER' = 'HEALER',
  'TANK' = 'TANK',
  'RANGED PHYSICAL DPS' = 'RANGED PHYSICAL DPS',
  'MELEE PHYSICAL DPS' = 'MELEE PHYSICAL DPS',
  'RANGED MAGIC DPS' = 'RANGED MAGIC DPS',
  'DPS' = 'DPS',
}