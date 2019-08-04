import SQL from 'sql-template-strings';
import {Action} from '../../types';

const addTeam: Action = {
  perform: async (db, command, msg) => {
    console.info('performing add team action', command);
    const result = await db.run(SQL`
      INSERT INTO ServerTeam (name, creator, created_at, modified_at)
      VALUES  (${command.data.name}, 'tmp', ${(new Date()).toISOString()}, ${(new Date()).toISOString()})
    `);
    console.info('> result', result);
    await msg.channel.send(`Added team ${command.data.name}!`);
  },
  command: 'addteam',
  parseMessage: function (prefix, {content}) {
    const remaining = content.slice(`${prefix} ${addTeam.command}`.length).trim().split(' ');
    return {
      command: addTeam.command,
      data: {
        name: remaining.join(' ')
      }
    }
  }
}

export default addTeam;