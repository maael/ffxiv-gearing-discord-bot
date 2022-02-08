import SQL from 'sql-template-strings';
import { TextChannel } from 'discord.js';
import {Action} from '../../types';

const removeFromTeam: Action = {
  perform: async (db, command, msg) => {
    console.info('performing remove from team action', command);
    if (!(msg.channel instanceof TextChannel)) {
      await msg.channel.send(`Command must be done in a Text Channel!`);
      return;
    }
    const results = await db.all(SQL`SELECT * FROM ServerTeam WHERE discord_server = ${msg.channel.guild.id} AND name = ${command.data.teamName}`);
    if (results.length) {
      const deleteResult = await db.all(SQL`DELETE FROM TeamMember WHERE server_team_id = ${results[0].id} AND ffxiv_character = ${command.data.name} AND ffxiv_server = ${command.data.server}`);
      console.info('db>', deleteResult);
      await msg.channel.send(`Removed ${command.data.name} (${command.data.server}) from team '${command.data.teamName}'`);
    } else {
      await msg.channel.send(`No team '${command.data.teamName}' exists!`);
    }


  },
  command: 'removefromteam',
  parseMessage: function (prefix, {content}) {
    const remaining = content.slice(`${prefix} ${removeFromTeam.command}`.length).trim().split(' ');
    return {
      command: removeFromTeam.command,
      data: {
        teamName: remaining[0],
        server: remaining[1],
        name: remaining.slice(2).join(' ')
      }
    }
  }
}

export default removeFromTeam;