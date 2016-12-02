const fs = require('fs')
var Guilds = require('../data/guilds.json')

module.exports = {
    'add_guild': (bot, commands) =>{
        for(var guild_id of bot.guilds.keys()){
            if(!Guilds.hasOwnProperty(guild_id)){
                Guilds[guild_id] = {}
                Guilds[guild_id].name = bot.guilds.get(guild_id).name
                Guilds[guild_id].owner = bot.guilds.get(guild_id).ownerID
                Guilds[guild_id].roles = {}
                for(var role of bot.guilds.get(guild_id).roles){
                    Guilds[guild_id].roles[role[1].id] = {}
                    Guilds[guild_id].roles[role[1].id].name = role[1].name
                    Guilds[guild_id].roles[role[1].id].is_admin = false
                    Guilds[guild_id].roles[role[1].id].visible = false
                    Guilds[guild_id].roles[role[1].id].visible_channels = []
                    Guilds[guild_id].roles[role[1].id].command_blacklist = []
                }
            Guilds[guild_id].enabled_commands = (commands.commands('get_commands'))
            }
        }
        return Guilds
    },
    
    'save_guild': (Guilds) =>{
        fs.writeFile('./data/guilds.json', JSON.stringify(Guilds), (err) => {
        if (err) console.log(err)
        })
        //update the guild variable
        Guilds = require('../data/guilds.json')
    },
    
    'get_guild': (guild_id) =>{
        if(Guilds.hasOwnProperty(guild_id)){
            return Guilds[guild_id]
        }else if(guild_id == undefined){
            return Guilds
        }else{
            false
        }
    }
}