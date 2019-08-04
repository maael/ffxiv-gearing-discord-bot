import SQL from 'sql-template-strings';
import {Action} from '../../types';

const ListTeams: Action = {
  perform: async (db, command, msg) => {
    console.info('performing list teams action', command);
    const results = await db.all(SQL`SELECT * FROM ServerTeam`);
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