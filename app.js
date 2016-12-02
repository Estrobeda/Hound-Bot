const fs = require('fs')
const Discord = require('discord.js')
const bot = new Discord.Client()
const Commands = require('./modules/commands.js')
const Usr = require('./modules/user.js')
const Config = require('./data/config.json')
var Guilds = require('./modules/guilds.js')

bot.on('ready', () => {
  console.log('Bot is Online')

  var guilds = Guilds.add_guild(bot, Commands) //whoola
  Guilds.save_guild(guilds)
  //Create custom guilds
  
  Usr.initiateSave()
})

bot.on('message', message => {
  if (!message.content.startsWith(Config.prefix)){
    Usr.addExperience(message) 
    return
  }
  
  //Check if the user has the ability to use the bot and if the bot even has the command
  var userroles = []
  for(var i of message.guild.member(message.author).roles) userroles.push(i)
  if(message.author.id == Guilds.get_guild(message.guild.id).owner ||
    (Guilds.get_guild(message.guild.id).roles[userroles[userroles.length-1][0]].command_blacklist.indexOf(message.content.slice(1).split(' ')[0].toLowerCase()) == -1 && 
    Guilds.get_guild(message.guild.id).enabled_commands[Guilds.get_guild(message.guild.id).enabled_commands.indexOf(message.content.toLocaleLowerCase().slice(1).split(' ')[0])] != undefined)){
    Commands.commands(message)
  }
  if (message.content.toLowerCase() === '!reboot' && message.guild.member(message.author).hasPermission('ADMINISTRATOR')) bot.destroy()
})

bot.on('disconnected', () => {
  console.log('Bot Disconnected.')
})

process.on('unhandledRejection', err => {
  if (err.toString().indexOf('Forbidden') > 0) return console.log('Bot cannot talk in this channel.')
  console.error('Uncaught Promise Error: \n' + err.stack)
})

bot.login(process.env.HOUND_BOT_TOKEN)
