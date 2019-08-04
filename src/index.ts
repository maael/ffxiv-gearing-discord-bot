import {join} from 'path';
import * as Discord from 'discord.js';
import sqlite, {Database} from 'sqlite';
import executeMatchedAction from './actions';
const client = new Discord.Client();

const {DISCORD_TOKEN, DEBUG} = process.env;

let db: Database;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
  console.info('incoming_message', msg.content);
  await executeMatchedAction(db, client, msg);
});

/**
 * IDEA:
 * Get user id from discord
 * Store multiple teams against user ids
 * Store gear set against user ids
 * Allow fetching of users via team id
 * Allow printing of table of users in a team
 *
 * Done via discord user id as id in mongodb (or better db, mongodb is pretty rammel)
 */

(async () => {
  db = await sqlite.open(join(__dirname, '..', 'db.sql'));
  await db.migrate({ force: DEBUG ? 'last' : undefined });
  await client.login(DISCORD_TOKEN);
})();

