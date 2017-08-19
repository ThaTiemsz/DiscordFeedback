const Config = require('../config.js')
const Raven = require('raven')

Raven.config(Config.discord.sentry).install()

module.exports = {
  log: (bot, cObj, fullErr) => {
    if (fullErr !== undefined) Raven.captureException(fullErr)
    bot.Channels.find((c) => c.name === 'bot-error').sendMessage(`Encountered an error while trying to run ${cObj.cause}.\nReturned error: \`\`\`${cObj.message}\`\`\``)
  },
  raven: (e) => {
    return Raven.captureException(e)
  }
}