const Config = require('../config.js')
const Raven = require('raven')

if (Config.debug === true) {
  Raven.config(Config.services.sentry, {
    environment: "development"
  }).install()
} else {
  Raven.config(Config.services.sentry, {
    environment: "production"
  }).install()
}

module.exports = {
  log: (bot, cObj, fullErr) => {
    if (fullErr !== undefined) Raven.captureException(fullErr)
    bot.Channels.find((c) => c.name === 'bot-error').sendMessage(`Encountered an error while trying to run ${cObj.cause}.\nReturned error: \`\`\`${cObj.message}\`\`\``)
  },
  raven: (error, extra) => Raven.captureException(error, { extra })
}