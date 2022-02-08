import SQL from 'sql-template-strings';
import { TextChannel } from 'discord.js';
import {Action} from '../../types';

const removeTeam: Action = {
  perform: async (db, command, msg) => {
    console.info('performing remove team action', command);
    if (!(msg.channel instanceof TextChannel)) {
      await msg.channel.send(`Command must be done in a Text Channel!`);
      return;
    }
    const results = await db.all(SQL`DELETE FROM ServerTeam WHERE discord_server = ${msg.channel.guild.id} AND name = ${command.data.teamName}`);
    console.info('db>', results);
    await msg.channel.send(`Deleted team '${command.data.teamName}'`);
  },
  command: 'removeteam',
  parseMessage: function (prefix, {content}) {
    const remaining = content.slice(`${prefix} ${removeTeam.command}`.length).trim().split(' ');
    return {
      command: removeTeam.command,
      data: {
        teamName: remaining.join(' ')
      }
    }
  }
}

export default removeTeam;