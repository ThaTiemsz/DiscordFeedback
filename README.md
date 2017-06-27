# DiscordFeedback
This is the bot that powers the Discord Feedback server, dev'd by the volunteer group only known as "Discord Feedback Bot Tinkerers Sqaud™"

# Development
We here at Discord Feedback Bot Tinkerers Sqaud™ use Visual Studio Code, with the ESLint, npm, npm Intellisense vscode plugins in order to produce the best code.

## Config
We like to keep things simple, just add ``debug: true,`` to the config, right after the first line
```
let Config = {
  debug: true,
  discord: {...}
}
```

## ESlint installed globally
ESlint has the option to install globally (allows for cmd line useage, which "can" be helpful for coding), however we use a few plugins for that that won't work out out box, so you'll need to install them. We've had luck using
```
npm i -g eslint eslint-plugin-standard@latest eslint-plugin-promise@latest eslint-plugin-import eslint-config-standard@latest eslint-plugin-node@latest
```

## Coming soon!
Tests! You can figure out if you broke something sending us a super cool feature with a simple `npm test`!

# Selfhosting
We don't (fully) support running your own copy of our bot, as its highly customized for usage on the Discord Feedback server. This doesn't mean you can't run it, just that we don't have the time to help you make it run (you know, with making this bot and all).

Now, if you do want to run an instance, you need the following:

- UserVoice API keys
- Discord bot account
- [RethinkDB](https://www.rethinkdb.com)
- The bot to be installed (duh) `npm i`
- Discord server (duh)
  - Server **must** have channels named `bot-log`, `admin-queue` and `bot-error`, and the bot **must** have write access to these channels.
  
## Config creation
Config creation is pretty straightforward, everything you need is provided for you in the example config file (`config.example.js`), all the values in there are placeholders, just replace them with your own data and then save the file as `config.js` in the project root.

## Database initialization
We use a database to track things, so you gotta set up our stuff luckly for you we made it super simple with out dbcreate script™. Just Run `npm run-script dbcreate` in the project root in order to initialize RethinkDB with those tables that are needed, and you're good to go!

## Starting
Starting the bot is super simple, just run `npm start`, we would like to note that there will be little if any console output as all bot errors go to [Bugsnag](http://bugsnag.com) for error reporting.

---

<p align="center">
  <img src="https://discordapp.com/api/v7/guilds/268811439588900865/widget.png?style=banner3">
</p>
