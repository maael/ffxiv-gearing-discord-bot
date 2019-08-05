import {Database} from 'sqlite';
import {Client, Message} from 'discord.js';
import {Action} from '../types';
import addTeam from './addTeam';
import getGear from './getGear';
import listTeams from './listTeams';
import marketPrice from './marketPrice';
import addToTeam from './addToTeam';
import listTeamMembers from './listTeamMembers';
import displayTeamMembers from './displayTeamMembers';
import {getEmoji} from '../util';

const PREFIX = '!ffdev';

function composeAction (action: Action<any>) {
  return async (db: Database, message: Message) => {
    const parsedArgs = action.parseMessage(PREFIX, message);
    return action.perform(db, parsedArgs, message);
  }
}

export const actionMap = {
  [addTeam.command]: composeAction(addTeam),
  [getGear.command]: composeAction(getGear),
  [listTeams.command]: composeAction(listTeams),
  [marketPrice.command]: composeAction(marketPrice),
  [addToTeam.command]: composeAction(addToTeam),
  [listTeamMembers.command]: composeAction(listTeamMembers),
  [displayTeamMembers.command]: composeAction(displayTeamMembers)
}

export default async (db: Database, client: Client, message: Message) => {
  if (!message.content.startsWith(PREFIX)) return;
  const reaction = await message.react('🤔');
  try {
    const match = Object.entries(actionMap).find(([cmd]) =>  (
      message.content.startsWith(`${PREFIX} ${cmd} `) || message.content === `${PREFIX} ${cmd}`
    ));
    if (match) {
      const [cmd, act] = match;
      console.info('cmd_start', cmd);
      await act(db, message);
      console.info('cmd_end', cmd);
    } else {
      console.info('cmd_miss', message.content);
      await message.reply(`Sorry, that command doesn\'t exist!
      These are the available commands:
      ${Object.entries(actionMap).map(([cmd]) =>  (
        `  - **${cmd}**`
      )).join('\n      ')}
      `);
    }
  } catch (e) {
    console.error(e);
    await message.react(getEmoji(client, 'dps'));
  } finally {
    await reaction.remove(client.user);
  }
}