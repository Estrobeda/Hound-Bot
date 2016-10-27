const Discord = require('discord.js')
const bot = new Discord.Client()
const Message = require('./message.js')
const fn = require('./functions.js')

'use strict'

bot.on('ready', () => {
  console.log('Bot is Online')
})

bot.on('message', message => {
  fn.initiateSave()
  console.log(message.author.username + ' - ' + message.guild.name + ' says: ' + message.content)
  Message.cmds(message)
})

bot.on('disconnected', () => {
  console.log('Bot Disconnected.')
})

bot.login(process.env.HOUND_BOT_TOKEN)
