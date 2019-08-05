import SQL from 'sql-template-strings';
import getGear from '../getGear';
import {Action} from '../../types';

const DisplayTeamMembers: Action = {
  perform: async (db, command, msg) => {
    console.info('performing list team members action', command);
    const results = await db.all(SQL`SELECT * FROM ServerTeam WHERE name = ${command.data.teamName}`);
    if (results.length) {
      const members = await db.all(SQL`SELECT * FROM TeamMember WHERE server_team_id = ${results[0].id}`);
      await Promise.all(members.map(({ffxiv_server, ffxiv_character}) => (
        getGear.perform(db, {command: getGear.command, data: {server: ffxiv_server, name: ffxiv_character}}, msg)
      )));
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