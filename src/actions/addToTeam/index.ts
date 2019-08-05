import SQL from 'sql-template-strings';
import getGear from '../getGear';
import {Action} from '../../types';

const addToTeam: Action = {
  perform: async (db, command, msg) => {
    console.info('performing add team action', command);
    const results = await db.all(SQL`SELECT * FROM ServerTeam WHERE name = ${command.data.teamName}`);
    if (results.length) {
      const {character} = await getGear.perform(db, {command: getGear.command, data: {server: command.data.server, name: command.data.name}}, msg);
      await db.run(SQL`
        INSERT INTO TeamMember (server_team_id, ffxiv_server, ffxiv_character, ffxiv_class, ffxiv_ilvl, created_at, modified_at)
        VALUES  (${results[0].id}, ${command.data.server}, ${command.data.name}, ${character.job}, ${character.ilvl}, ${(new Date()).toISOString()}, ${(new Date()).toISOString()})
      `);
      await msg.channel.send(`Added ${command.data.name} on ${command.data.server} to team ${command.data.teamName}!`);
    } else {
      await msg.channel.send(`No team '${command.data.teamName}' exists!`);
    }
  },
  command: 'addtoteam',
  parseMessage: function (prefix, {content}) {
    const remaining = content.slice(`${prefix} ${addToTeam.command}`.length).trim().split(' ');
    return {
      command: addToTeam.command,
      data: {
        teamName: remaining[0],
        server: remaining[1],
        name: remaining.slice(2).join(' ')
      }
    }
  }
}

export default addToTeam;