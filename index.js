const Discord = require('discord.js')
const UserVoice = require('uservoice-nodejs')
const Config = require('./config.js')
const logger = require('./Utils/error_loggers')
const Commands = require('./Utils/command_engine').Commands
const AccessChecker = require('./Utils/access_checker')
const genlog = require('./Utils/generic_logger')
const woofmeow = require('./Utils/woofmeow')
const Analytics = require('./Utils/orwell')
const bot = new Discord.Client()

const UVRegex = /https?:\/\/[\w.]+\/forums\/(\d{6,})-[\w-]+\/suggestions\/(\d{7,})(?:-[\w-]*)?/

const uvClient = {
  v1: new UserVoice.Client({
    subdomain: Config.uservoice.subdomain.trim(),
    domain: Config.uservoice.domain.trim(),
    apiKey: Config.uservoice.key.trim(),
    apiSecret: Config.uservoice.secret.trim()
  }),
  v2: new UserVoice.ClientV2({
    clientId: Config.uservoice.key.trim(),
    subdomain: Config.uservoice.UVDomain.trim()
  })
}

bot.on('message', (message) => {
  if (message.channel.type === 'dm') return
  if (message.channel.id !== Config.discord.feedChannel && message.content.match(UVRegex) !== null && message.content.indexOf(Config.discord.prefix) !== 0) {
    let parts = message.content.match(UVRegex)
    Commands['chatVoteInit'].fn(message, parts[2], uvClient)
  }
  if (message.channel.id === Config.discord.feedChannel && message.author.id !== bot.user.id && message.author.bot) {
    Commands['newCardInit'].fn(message)
    return
  }
  if (!message.author.bot) {
    Analytics.awardPoints(message.author.id, 'messages')
  }
  if (message.content.indexOf(Config.discord.prefix) !== 0) return
  let cmd = message.content.substr(Config.discord.prefix.length).split(' ')[0].toLowerCase()
  let suffix
  suffix = message.content.substr(Config.discord.prefix.length).split(' ')
  suffix = suffix.slice(1, suffix.length).join(' ')
  let msg = message
  if (!Commands[cmd]) return
  if (Commands[cmd].internal === true) return
  AccessChecker.getLevel(msg.member, (level) => {
    if (level === 0 && Commands[cmd].modOnly === true) {
      if (Commands[cmd].phantom !== undefined) msg.reply('this command is restricted, and not available to you.')
      return
    } else if (level !== 2 && Commands[cmd].adminOnly === true) return
    try {
      Commands[cmd].fn(bot, msg, suffix, uvClient, (res) => {
        genlog.log(bot, message.author, {
          message: `Ran the command \`${cmd}\``,
          result: res.result,
          affected: res.affected,
          awardPoints: true
        })
      })
    } catch (e) {
      logger.log(bot, {
        cause: cmd,
        message: e.message
      })
      woofmeow.woofmeow().then(c => {
        msg.reply(`an error occurred while processing this command, the admins have been alerted, please try again later.\nHere's your consolation animal image: ${c}`)
      })
    }
  })
})

bot.on('messageReactionAdd', (r, user) => {
  if (user.id !== bot.user.id) {
    if (r.message === null) {
      bot.channels.get(r.message.channel.id).fetchMessage(r.message.id).then((msg) => {
        r.message = msg
      })
    }
    Commands['registerVote'].fn(r.message, r.emoji, bot, uvClient, user)
  }
})

bot.on('guildMemberUpdate', (o, n) => {
  const custodianRole = '268815388882632704'
  if (o.roles.has(custodianRole) === false && n.roles.has(custodianRole) === true) bot.channels.get('284796966641205249').send(`Welcome ${c.member} to the custodians!`)
})

bot.on('ready', () => {
  setInterval(() => {
    bot.guilds.get(Config.discord.guild).fetchMembers() // Hacky way to cache offline users, #blamelazyloading
  }, 600000)
  console.log('Feedback bot is ready!')
  
  // Autorole!
  Analytics.roleUsers(bot.guilds.get(Config.discord.guild), bot)
  setInterval(() => {
    Analytics.roleUsers(bot.guilds.get(Config.discord.guild), bot)
  }, 3600000) // once an hour

  Commands['initializeTop'].fn(bot, uvClient)
})

process.on('uncaughtException', (err) => {
  logger.raven(err.stack || err)
})

process.on('unhandledRejection', (reason, p) => {
  if (p !== null && reason !== null) {
    if (p instanceof Error) logger.raven(p)
    else logger.raven(new Error(`Unhandled promise: ${require('util').inspect(p, {depth: 3})}: ${reason}`))
  }
})

bot.on('disconnect', () => {
  console.error('Connection to Discord has been lost...')
})

bot.on('resume', () => {
  console.log('Reconnected.')
})

bot.login(Config.discord.token)
