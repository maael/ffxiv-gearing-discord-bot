import {Action} from '../../types';

const info: Action = {
  perform: async (_db, _command, msg) => {
    await msg.channel.send(`Info:\n  - Version: Kweh1.1`);
  },
  command: 'info',
  parseMessage: function () {
    return {
      command: info.command,
      data: {}
    };
  }
}

export default info;