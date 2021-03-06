import SQL from 'sql-template-strings';
import { TextChannel } from 'discord.js';
import {Action} from '../../types';

const ListTeamMembers: Action = {
  perform: async (db, command, msg) => {
    console.info('performing list team members action', command);
    if (!(msg.channel instanceof TextChannel)) {
      await msg.channel.send(`Command must be done in a Text Channel!`);
      return;
    }
    const results = await db.all(SQL`SELECT * FROM ServerTeam WHERE name = ${command.data.teamName} AND discord_server = ${msg.channel.guild.id}`);
    if (results.length) {
      const members = await db.all(SQL`SELECT * FROM TeamMember WHERE server_team_id = ${results[0].id}`);
      const membersList = members.map(({ffxiv_character, ffxiv_class, ffxiv_ilvl, ffxiv_server}) => (
        `- ${ffxiv_character} ${ffxiv_class} ${ffxiv_ilvl} ${ffxiv_server}`
      )).join('\n      ');
      await msg.channel.send(`Teams Members:\n      ${membersList}`);
    } else {
      await msg.channel.send(`No team '${command.data.teamName}' exists!`);
    }
  },
  command: 'listteam',
  parseMessage: function (prefix, {content}) {
    const remaining = content.slice(`${prefix} ${ListTeamMembers.command}`.length).trim().split(' ');
    return {
      command: ListTeamMembers.command,
      data: {
        teamName: remaining.join('')
      }
    }
  }
}

export default ListTeamMembers;