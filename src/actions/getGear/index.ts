import {URL} from 'url';
import * as Discord from 'discord.js';
import * as got from 'got';
import {XIVAPI_Character, XIVAPI_CharacterDetails, XIVAPI_ItemDetails, RoleColours, Action} from '../../types';
import {jobRoleMap, reorderGear, wait, wrapStringToLength} from '../../util';

async function getCharacter (server: string, name: string): Promise<XIVAPI_Character> {
  console.info('get_gearset', 'get_character', 'start', server, name);
  const u = new URL('https://xivapi.com/character/search');
  u.searchParams.set('name', name);
  u.searchParams.set('server', server);
  const result = (await got.get(u.href, {json: true})).body.Results;
  console.info('get_gearset', 'get_character', 'end', server, name);
  return result.find(({Name, Server}: any) => Name === name && Server === server);
}

async function safeCharacterGet(id: string): Promise<XIVAPI_CharacterDetails> {
  console.info('get_gearset', 'safe_get_character_details', 'start', id);
  const u = new URL(`https://xivapi.com/character/${id}?extended=1`);
  const result = (await got.get(u.href, {json: true})).body;
  if (result.Info.Character.State !== 2) {
    console.info('get_gearset', 'safe_get_character_details', 'retry', id, result);
    await wait(5000);
    return await safeCharacterGet(id);
  }
  console.info('get_gearset', 'safe_get_character_details', 'end', id);
  return result;
}

async function getCharacterDetails(id: string): Promise<{gear: Record<string, string>, job: string, updated: number}> {
  console.info('get_gearset', 'get_character_details', 'start', id);
  const result = await safeCharacterGet(id);
  console.info('get_gearset', 'get_character_details', 'end', id);
  return {
    gear: Object.entries(result.Character.GearSet.Gear).reduce((ob, [p, g]) => ({...ob, [p]: g.Item.ID}), {}),
    job: result.Character.ActiveClassJob.Job.Abbreviation,
    updated: result.Info.Character.Updated
  };
}

async function getItems(gear: Record<string, string>) {
  console.info('get_gearset', 'get_items', 'start');
  const m = new Map<string, any>(Object.entries(gear));
  const u = new URL(`https://xivapi.com/item?ids=${Object.values(gear).join(',')}`);
  const result = (await got.get(u.href, {json: true})).body.Results;
  const details = await Promise.all<any>(result.map(async ({ID}: {ID: string}) => getItemDetail(ID)));
  Array.from(m.entries()).forEach(([k, id]) => {
    const foundItem = details.find(({ID}) => ID === id);
    if (foundItem) {
      m.set(k, foundItem);
    }
  });
  console.info('get_gearset', 'get_items', 'end');
  return Array.from(m.entries()).reduce((obj, [k, i]) => ({...obj, [k]: i}), {});
}

async function getItemDetail(id: string): Promise<XIVAPI_ItemDetails> {
  console.info('get_gearset', 'get_item_details', 'start', id);
  const u = new URL(`https://xivapi.com/Item/${id}?columns=ID,LevelItem,Name,Icon`);
  const base = (await got.get(u.href, {json: true})).body;
  if (base.Icon) {
    base.Icon = `https://xivapi.com${base.Icon.replace(/\\/g)}`;
  }
  console.info('get_gearset', 'get_item_details', 'end', id);
  return base;
}

function getAvgILevel (o: Record<string, XIVAPI_ItemDetails>): number {
  return Math.floor(Object.values(o).reduce((s, {Name, LevelItem}) => s + (Name.startsWith('Soul') ? 0 : LevelItem), 0) / (Object.values(o).length - 1));
}

const getGear: Action = {
  perform: async (_db, {command, data: {server, name}}, msg) => {
    console.info('performing new get gear action', command);
    const character = await getCharacter(server, name);
    const {gear, job, updated} = await getCharacterDetails(character.ID);
    const mapped = await getItems(gear);
    const reorderedGear = reorderGear(mapped);
    const avgILevel = getAvgILevel(mapped);
    const exampleEmbed = new Discord.RichEmbed()
      .setTitle(`[${job}] ${character.Name} [${character.Server}] (i${avgILevel})`)
      .setThumbnail(character.Avatar)
      .setURL(`https://eu.finalfantasyxiv.com/lodestone/character/${character.ID}/`)
      .setTimestamp(new Date(updated * 1000))
      .setColor(RoleColours[(jobRoleMap as any)[job]] || 'GREY');
    Object.entries(reorderedGear).forEach(([k, i]) => {
      if (k === 'Empty') {
        exampleEmbed.addBlankField(true);
      } else {
        const key = `${k.replace(/([A-Z12])/g, ' $1').trim()} (i${(i as  any).LevelItem})`;
        const value = wrapStringToLength(`${(i as any).Name || '?'}`, 1200);
        exampleEmbed.addField(key, value, true);
      }
    });
    console.info('character_result', JSON.stringify({
      character,
      ilvl: avgILevel,
      gear: reorderedGear,
      job,
      updated
    }));
    await msg.channel.send(exampleEmbed);
    console.info('result_sent');
  },
  command: 'gear',
  parseMessage: function (prefix, {content}) {
    console.info('hi', content, `${prefix} ${getGear.command}`);
    const remaining = content.slice(`${prefix} ${getGear.command}`.length).trim().split(' ');
    return {
      command: getGear.command,
      data: {
        server: remaining[0],
        name: `${remaining[1]} ${remaining[2]}`
      }
    }
  }
}

export default getGear;