import SQL from 'sql-template-strings';
import { TextChannel } from 'discord.js';
import {Action} from '../../types';

const ListTeams: Action = {
  perform: async (db, command, msg) => {
    console.info('performing list teams action', command);
    if (!(msg.channel instanceof TextChannel)) {
      await msg.channel.send(`Command must be done in a Text Channel!`);
      return;
    }
    const results = await db.all(SQL`SELECT * FROM ServerTeam WHERE discord_server = ${msg.channel.guild.id}`);
    console.info('db>', results);
    await msg.channel.send(`Teams: ${results.map(({name}) => name).join(', ')}`);
  },
  command: 'listteams',
  parseMessage: function () {
    return {
      command: ListTeams.command,
      data: {}
    }
  }
}

export default ListTeams;