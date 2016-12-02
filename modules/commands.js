require('docstring')
const Admin = require('./admin.js')
const commands = require('./functions.js')
const User = require('./user.js')
const Voice = require('./voice.js')
const Guilds = require('./guilds.js')

var command_functions = []
var command_text = ""

exports.commands = (message) => {
  const commands = {
    'commands': (message) => {
     // const custom_commands = command_text
      console.log(command_text)
      message.channel.sendMessage(command_text)
    },
    'timer': (message) => {
      /**Show the time in a specific timezone*/
      commands.getTime(message).then(response => message.reply(response)).catch(err => message.reply(err))
    },
    'mute': (message) => {
      /**Mute a mentioned user*/
      Admin.mute(message)
    },
    'unmute': (message) => {
      /**Unmute a mentioned user*/
      Admin.unmute(message)
    },
    'role': (message) => {
      /**Sets a specific role for a certain user*/
      var available_roles = []
      if (message.guild.id === Guilds.get_guild(message.guild.id)) {
        for(var role of Guilds.get_guild(message.guild.id).roles){
          if (role.is_visible && role.name == message){
            User.toggleRole(message, role[0])
          }
        }
      }
    },
    'ping': (message) => {
      /**Ping pong*/
      message.channel.sendMessage('Pong!')
    },
    'coin': (message) => {
      /**Flips a coin*/
      if (Math.floor(Math.random() * 2 + 1) === 1) {
        message.channel.sendMessage('Heads')
      } else {
        message.channel.sendMessage('Tails')
      }
    },
    'dice': (message) => {
      var argsDice = message.content.split(' ')
      if (argsDice[1] !== undefined) {
        message.channel.sendMessage(Math.floor(Math.random() * parseInt(argsDice[1]) + 1))
      } else {
        message.channel.sendFile('./data/img/dice' + Math.floor((Math.random() * 6) + 1) + '.png')
      }
    },
    'slap': (message) => {
      if (message.mentions.users.array().length >= 0) {
        for (var slapTarget of message.mentions.users.array()) {
          message.channel.sendMessage(slapTarget + ' You\'ve been SLAPPED!')
        }
        message.delete
      }
    },
    'cat': (message) => {
      commands.apiRequest('http://random.cat/meow').then(response => message.channel.sendMessage(response.file))
    },
    'insult': (message) => {
      if (message.mentions.users.array().length >= 0) {
        for (var insultTarget of message.mentions.users.array()) {
          commands.apiRequest('https://quandyfactory.com/insult/json')
          .then(response => message.channel.sendMessage(insultTarget + ' ' + response.insult))
        }
      }
    },
    'to_f': (message) => {
      var C = message.content.split(' ')[1]
      var toF = (C * 1.8 + 32).toFixed(0)
      message.reply(toF)
    },
    'to_c': (message) => {
      var F = message.content.split(' ')[1]
      var toC = ((F - 32) * (5 / 9)).toFixed(0)
      message.reply(toC)
    },
    'to_k': (message) => {
      var K = parseInt(message.content.split(' ')[1]) + 273.15
      message.reply(K)
    },
    'wipe': (message) => {
      Admin.wipe(message)
    },
    'boom': (message) => {
      var x = Math.floor(Math.random() * 5 + 1)
      message.channel.sendFile('./data/img/boom' + x + '.jpeg')
    },
    'chuck': (message) => {
      commands.apiRequest('https://api.chucknorris.io/jokes/random')
        .then(response => message.channel.sendMessage(response.value))
    },
    'toast': (message) => {
      message.channel.sendMessage(`\`\`\`
        Toast!
              ______
         ____((     )_
        |\'->==))   (= \\
        |  \\ ||_____|_ \\
        |[> \\___________\\
        | | |            |                                    |
         \\  |            |             .--.                   |
          \\ |            |)---.   .---\'    \`-.         .----(]|
           \\|____________|     \`-'            \`.     .\'       |
                                                \`---\'         |
        \`\`\`
        `)
      message.delete
    },
    'add': (message) => {
      /*if (message.member.roles.exists('id', Config.guilds.milhound.roles.requestBAN)) return message.delete(1000)
      if (message.guild.id === Config.guilds.milhound.id && message.channel.id !== Config.guilds.milhound.channels.music) return message.reply('All music commands must be done in #music.')
      */Voice.add(message)
    },
    'queue': (message) => {
     // if (message.guild.id === Config.guilds.milhound.id && message.channel.id !== Config.guilds.milhound.channels.music) return message.reply('All music commands must be done in #music.')
      Voice.queue(message)
    },
    'play': (message, alreadyAdded) => {
      /*if (message.member.roles.exists('id', Config.guilds.milhound.roles.requestBAN)) return message.delete(1000)
      if (message.guild.id === Config.guilds.milhound.id && message.channel.id !== Config.guilds.milhound.channels.music) return message.reply('All music commands must be done in #music.')
      */Voice.play(message, alreadyAdded)
    },
    'yt': (message) => {
      const queryYt = message.content.slice(3).trim().replace(' ', '%20')
      const urlYt = baseYtUrl + queryYt + '&key=' + apiKey
      commands.apiRequest(urlYt)
      .then(info => message.reply('https://www.youtube.com/watch?v=' + info.items[0].id.videoId))
    },
    'request': (message) => {
      /*if (message.member.roles.exists('id', Config.guilds.milhound.roles.requestBAN)) return message.delete(1000)
      if (message.guild.id === Config.guilds.milhound.id && message.channel.id !== Config.guilds.milhound.channels.music) return message.reply('All music commands must be done in #music.')
      */if (message.length <= 9) return message.reply('Please specifiy a song.')
      Voice.request(message)
    },
    'level': (message) => {
      /**This will be a really really long message about what the heck a level is, infact, I will bring it to the next level*/
      User.level(message)
    },
    'addlevel': (message) => {
      if (message.guild.member(message.author).hasPermission('ADMINISTRATOR')) {
        User.addLevel(message)
      }
    },
    'exp': (message) => {
      if (message.guild.member(message.author).hasPermission('ADMINISTRATOR')) {
        User.modifyExp(message)
      }
    },
    'leaderboard': (message) => {
      User.leaderboard(message).then((response) => message.channel.sendMessage(response)).catch((err) => message.channel.sendMessage(err))
    },
    'kick': (message) => {
      Admin.kick(message)
    },
    'ban': (message) => {
      Admin.ban(message)
    },
    'radio': (message) => {
      Voice.streamFromURL(message, 'http://stream1.ml1.t4e.dj/dublovers_high.mp3')
    },
    'weeb': (message) => {
      Voice.streamFromURL(message, 'http://shinsen-radio.org:8000/shinsen-radio.128.mp3')
    },
    'mix': (message) => {
      
      Voice.streamFromURL(message, 'http://14963.live.streamtheworld.com/KHMXFMAAC?streamtheworld_user=1&SRC=CBS&DIST=CBS&TGT=cbslocalplayer&demographic=false')
    },
    'test': (message) => {
      /**Test Command to do [I have not a clue]*/
      if (message.content.split(' ')[1]) var url = message.content.split(' ')[1]
      if (url.indexOf('http') === -1) return
      Voice.streamFromURL(message, url)
    },
    
    'blacklist': (message) => {
      /**Blacklist certain commands for users.*/
      for(var id in Guilds.get_guild(message.guild.id).roles){
        if(Guilds.get_guild(message.guild.id).roles[id].name == message.content.split(' ')[1]){
          //var temp_array = Array(Guilds.get_guild(message.guild.id).roles[id].command_blacklist)
          //temp_array.push(message.content.split(' ')[2])
          Guilds.get_guild(message.guild.id).roles[id].command_blacklist.push(message.content.split(' ')[2])
          Guilds.save_guild(Guilds.get_guild())
        }
      }
    }
  }
  
  //!!! Improve
  
  //Helpfile formatter
  if(message == 'get_commands' || (message.content != undefined && message.content.toLocaleLowerCase().slice(1).split(' ')[0] == 'commands')){ 
      for(var func in commands){
        command_functions.push(func)
        //console.log(Guilds.get_guild(message.guild.id).enabled_commands.hasOwnProperty(func))
          if(message.guild != undefined){
            command_text += String(func) + ': '
            if(commands[func].__doc__ != null){
              command_text += String(commands[func].__doc__).slice(0, 46) + '\n'
            }else{
              command_text += 'No Description \n'
            }}}
      command_text = command_text.replace(' ','')
      if(message.content == undefined && message == "get_commands"){
        return command_functions
      }else{
        commands[message.content.toLowerCase().slice(1).split(' ')[0]](message) 
        return
      }
    }
  
  if ((message.content != undefined && commands.hasOwnProperty(message.content.toLowerCase().slice(1).split(' ')[0]))) {
    console.log(message.author.username + ' - ' + message.guild.name + ' used command: ' + message.content.slice(0))
    commands[message.content.toLowerCase().slice(1).split(' ')[0]](message)
  }
}
