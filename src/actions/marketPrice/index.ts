import {URL} from 'url';
import got from 'got';
import {Action} from '../../types';

const marketPrice: Action = {
  perform: async (_db, command, msg) => {
    console.info('performing market price check', command);
    const itemMatch = await searchItem(command.data.item);
    if (!itemMatch) {
      await msg.channel.send(`Couldn't find an item for ${command.data.item}!`);
    } else {
      const prices = await getMarketPrices(command.data.server, itemMatch.ID);
      const list = prices.Prices.slice(0, 10).map(({RetainerName, IsHQ, PricePerUnit, PriceTotal, Quantity}) => (
        `  - ${RetainerName}: ${Quantity} ${itemMatch.Name}'s at ${PricePerUnit} each, total ${PriceTotal}${IsHQ ? ' (HQ)' : ''}`
      )).join('\n      ');
      await msg.channel.send(`${command.data.item} Market Prices for ${command.data.server}:
      ${list}
      `);
    }
  },
  command: 'market',
  parseMessage: function (prefix, {content}) {
    const remaining = content.slice(`${prefix} ${marketPrice.command}`.length).trim().split(' ');
    return {
      command: marketPrice.command,
      data: {
        server: remaining[0],
        item: remaining.slice(1).join(' ')
      }
    }
  }
}

async function searchItem (search: string) {
  console.info('market_prices', 'search_item', 'start', search);
  const u = new URL('https://xivapi.com/search');
  u.searchParams.set('indexes', 'Item');
  u.searchParams.set('string', search);
  const result: Array<{Name: string, ID: number}> = (await got.get(u.href, {json: true})).body.Results;
  console.info('market_prices', 'search_item', 'end', search);
  return result.find(({Name}) => Name.toLowerCase() === search.toLowerCase()) || result[0];
}

async function getMarketPrices(server: string, itemId: number) {
  console.info('market_prices', 'get_market_prices', 'start', server, itemId);
  const u = new URL(`https://xivapi.com/market/${server}/item/${itemId}`);
  const result: {Prices: Array<{RetainerName: string, IsHQ: boolean, PricePerUnit: number, PriceTotal: number, Quantity: number}>} = (await got.get(u.href, {json: true})).body;
  console.info('market_prices', 'get_market_prices', 'end', server, itemId);
  return result;
}

export default marketPrice;