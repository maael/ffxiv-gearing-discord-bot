import SQL from 'sql-template-strings';
import { TextChannel } from 'discord.js';
import throat from 'throat';
import getGear from '../getGear';
import {Action} from '../../types';

const limiter = throat(1);

const DisplayTeamMembers: Action = {
  perform: async (db, command, msg) => {
    console.info('performing list team members action', command);
    if (!(msg.channel instanceof TextChannel)) {
      await msg.channel.send(`Command must be done in a Text Channel!`);
      return;
    }
    const results = await db.all(SQL`SELECT * FROM ServerTeam WHERE name = ${command.data.teamName} AND discord_server = ${msg.channel.guild.id}`);
    if (results.length) {
      const members = await db.all(SQL`SELECT * FROM TeamMember WHERE server_team_id = ${results[0].id}`);
      members.map(({ffxiv_server, ffxiv_character}) => (
        limiter(() => getGear.perform(db, {command: getGear.command, data: {server: ffxiv_server, name: ffxiv_character}}, msg))
      ));
      await limiter;
    } else {
      await msg.channel.send(`No team '${command.data.teamName}' exists!`);
    }
  },
  command: 'displayteam',
  parseMessage: function (prefix, {content}) {
    const remaining = content.slice(`${prefix} ${DisplayTeamMembers.command}`.length).trim().split(' ');
    return {
      command: DisplayTeamMembers.command,
      data: {
        teamName: remaining.join('')
      }
    }
  }
}

export default DisplayTeamMembers;