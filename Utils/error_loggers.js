const Config = require('../config.js')
const Raven = require('raven')

Raven.config(Config.services.sentry).install()

module.exports = {
  log: (bot, cObj, fullErr) => {
    if (fullErr !== undefined) Raven.captureException(fullErr)
    bot.Channels.find((c) => c.name === 'bot-error').sendMessage(`Encountered an error while trying to run ${cObj.cause}.\nReturned error: \`\`\`${cObj.message}\`\`\``)
  },
  raven: (error, extra) => Raven.captureException(error, { extra })
}