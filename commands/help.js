const discord = require('discord.js')
const fs = require('fs')
const config = require('../config.json')
const t = '	⁣'

exports.run = (client, message, args, adminRole) => {
    fs.readdir('./commands/', (err, files) => {
        if (err) {
            console.error(err)
            return message.channel.send({
                "embed": {
                    "description": "Something went wrong.",
                    "color": 1409939,
                    "footer": {
                        "text": `© Copyright Streampy Hosting - ${new Date().getFullYear()}`
                    }
                }
            })
        } else {
            var msg = {
                "embed": {
                    "title": "Help",
                    "description": "These are all the commands you have access to:\n\n**<>** = required, *[]* = optional, | = or",
                    "color": 1409939,
                    "footer": {
                        "text": `© Copyright Streampy Hosting - ${new Date().getFullYear()}`
                    },
                    "fields": []
                }
            }

            if (!args[0]) {
                msg.embed.fields.push({
                    name: '-----==={ }===-----',
                    value: `**Standard commands**\n${t}`
                })

                files.forEach(file => {
                    var content = require(`./${file}`).help

                    if (!content.isAdmin) {
                        var command = content.usage
                            .replace(/{{ *prefix *}}/g, `${config.settings.prefix}__`).replace(/ +/, '__ ')
                            .replace(/{{ *site *}}/g, config.settings.site)
                            .replace(/{{ *name *}}/g, client.user.username)
                            .replace(/{{ *s(erver)?name *}}/g, message.guild.name)
                            .replace(/{{ *maxwarns *}}/g, config.settings.max_warns)
                            .replace(/{{ *timemuted *}}/g, config.settings.time_muted)
                            .replace(/\[/g, '*[')
                            .replace(/\]/g, ']*')
                            .replace(/\</g, '**<')
                            .replace(/\>/g, '>**')

                        command = command.includes(' ')
                            ? command
                            : `${command}__`

                        var temp = {
                            name: content.name,
                            value: `${content.description
                                .replace(/{{ *prefix *}}/g, config.settings.prefix)
                                .replace(/{{ *site *}}/g, config.settings.site)
                                .replace(/{{ *name *}}/g, client.user.username)
                                .replace(/{{ *s(erver)?name *}}/g, message.guild.name)
                                .replace(/{{ *maxwarns *}}/g, config.settings.max_warns)
                                .replace(/{{ *timemuted *}}/g, config.settings.time_muted)}\n\n${command}\n${t}`
                        }

                        msg.embed.fields.push(temp)
                    }

                    delete require.cache[require.resolve(`./${file}`)]
                })

                if (message.member.roles.has(adminRole.id)) {
                    msg.embed.fields.push({
                        name: '-----==={ }===-----',
                        value: `**Admin commands**\n${t}`
                    })

                    files.forEach(file => {
                        var content = require(`./${file}`).help

                        if (content.isAdmin) {
                            var command = content.usage
                                .replace(/{{ *prefix *}}/g, `${config.settings.prefix}__`)
                                .replace(/ +/, '__ ')
                                .replace(/{{ *site *}}/g, config.settings.site)
                                .replace(/{{ *name *}}/g, client.user.username)
                                .replace(/{{ *s(erver)?name *}}/g, message.guild.name)
                                .replace(/{{ *maxwarns *}}/g, config.settings.max_warns)
                                .replace(/{{ *timemuted *}}/g, config.settings.time_muted)
                                .replace(/\[/g, '*[')
                                .replace(/\]/g, ']*')
                                .replace(/\</g, '**<')
                                .replace(/\>/g, '>**')

                            command = command.includes(' ')
                                ? command
                                : `${command}__`

                            var temp = {
                                name: content.name,
                                value: `${content.description
                                    .replace(/{{ *prefix *}}/g, config.settings.prefix)
                                    .replace(/{{ *site *}}/g, config.settings.site)
                                    .replace(/{{ *name *}}/g, client.user.username)
                                    .replace(/{{ *s(erver)?name *}}/g, message.guild.name)
                                    .replace(/{{ *maxwarns *}}/g, config.settings.max_warns)
                                    .replace(/{{ *timemuted *}}/g, config.settings.time_muted)}\n\n${command}\n${t}`
                            }

                            msg.embed.fields.push(temp)
                        }

                        delete require.cache[require.resolve(`./${file}`)]
                    })
                }
            } else if (args[0] != '' || args[0] != undefined || args[0] != null) {
                msg.embed.fields.push({
                    name: '-----==={ }===-----',
                    value: `**Commands like *${args[0].toLowerCase()}* **\n${t}`
                })

                files.forEach(file => {
                    var content = require(`./${file}`).help

                    if (!content.isAdmin) {
                        if (
                            content.name.toLowerCase() == args[0].toLowerCase() ||
                            content.command.toLowerCase() == args[0].toLowerCase() ||
                            content.command.toLowerCase().match(new RegExp(`${args[0].toLowerCase()}`))
                        ) {
                            var command = content.usage
                                .replace(/{{ *prefix *}}/g, `${config.settings.prefix}__`).replace(/ +/, '__ ')
                                .replace(/{{ *site *}}/g, config.settings.site)
                                .replace(/{{ *name *}}/g, client.user.username)
                                .replace(/{{ *s(erver)?name *}}/g, message.guild.name)
                                .replace(/{{ *maxwarns *}}/g, config.settings.max_warns)
                                .replace(/{{ *timemuted *}}/g, config.settings.time_muted)
                                .replace(/\[/g, '*[')
                                .replace(/\]/g, ']*')
                                .replace(/\</g, '**<')
                                .replace(/\>/g, '>**')

                            command = command.includes(' ')
                                ? command
                                : `${command}__`

                            var parameters = ''
                            if (content.params) {
                                Object.keys(content.params).forEach(key => {
                                    var param = content.params[key]
    
                                    var temp_param = `• `
                                    temp_param += param.required ? '__**' : '__*'
                                    temp_param += key
                                    temp_param += param.required ? '**__' : '*__'
                                    temp_param += `: ${param.description}`
    
                                    parameters += `${temp_param}\n`
                                })
                            }

                            var temp = {
                                name: '---=={ }==---',
                                value: `**${content.name}**\n${content.description
                                    .replace(/{{ *prefix *}}/g, config.settings.prefix)
                                    .replace(/{{ *site *}}/g, config.settings.site)
                                    .replace(/{{ *name *}}/g, client.user.username)
                                    .replace(/{{ *s(erver)?name *}}/g, message.guild.name)
                                    .replace(/{{ *maxwarns *}}/g, config.settings.max_warns)
                                    .replace(/{{ *timemuted *}}/g, config.settings.time_muted)}\n\n${command}${ content.params == null ? `\n${t}` : `\n\n**Parameters**\n${parameters}${t}` }`
                            }

                            msg.embed.fields.push(temp)
                        }
                    }

                    delete require.cache[require.resolve(`./${file}`)]
                })

                if (message.member.roles.has(adminRole.id)) {
                    msg.embed.fields.push({
                        name: '-----==={ }===-----',
                        value: `**Admin commands like *${args[0].toLowerCase()}* **\n${t}`
                    })
    
                    files.forEach(file => {
                        var content = require(`./${file}`).help

                        if (content.isAdmin) {
                            if (
                                content.name.toLowerCase() == args[0].toLowerCase() ||
                                content.command.toLowerCase() == args[0].toLowerCase() ||
                                content.command.toLowerCase().match(new RegExp(`${args[0].toLowerCase()}`))
                            ) {
                                var command = content.usage
                                    .replace(/{{ *prefix *}}/g, `${config.settings.prefix}__`).replace(/ +/, '__ ')
                                    .replace(/{{ *site *}}/g, config.settings.site)
                                    .replace(/{{ *name *}}/g, client.user.username)
                                    .replace(/{{ *s(erver)?name *}}/g, message.guild.name)
                                    .replace(/{{ *maxwarns *}}/g, config.settings.max_warns)
                                    .replace(/{{ *timemuted *}}/g, config.settings.time_muted)
                                    .replace(/\[/g, '*[')
                                    .replace(/\]/g, ']*')
                                    .replace(/\</g, '**<')
                                    .replace(/\>/g, '>**')

                                command = command.includes(' ')
                                    ? command
                                    : `${command}__`

                                var parameters = ''
                                if (content.params != null) {
                                    Object.keys(content.params).forEach(key => {
                                        var param = content.params[key]
    
                                        var temp_param = `• `
                                        temp_param += param.required ? '__**' : '__*'
                                        temp_param += key
                                        temp_param += param.required ? '**__' : '*__'
                                        temp_param += `: ${param.description}`
    
                                        parameters += `${temp_param}\n`
                                    })
                                }

                                var temp = {
                                    name: '---=={ }==---',
                                    value: `**${content.name}**\n${content.description
                                        .replace(/{{ *prefix *}}/g, config.settings.prefix)
                                        .replace(/{{ *site *}}/g, config.settings.site)
                                        .replace(/{{ *name *}}/g, client.user.username)
                                        .replace(/{{ *s(erver)?name *}}/g, message.guild.name)
                                        .replace(/{{ *maxwarns *}}/g, config.settings.max_warns)
                                        .replace(/{{ *timemuted *}}/g, config.settings.time_muted)}\n\n${command}${ content.params == null ? `\n${t}` : `\n\n**Parameters**\n${parameters}${t}` }`
                                }

                                msg.embed.fields.push(temp)
                            }
                        }

                        delete require.cache[require.resolve(`./${file}`)]
                    })
                }
            }

            message.author.send(msg)
            message.react('👌').then(() => setTimeout(() => message.delete(), 3000))
        }
    })
}

exports.help = {
    name: 'Help',
    description: 'Get a list of commands in your PM.',
    command: 'help',
    usage: '{{ prefix }}help [command]',
    params: {
        command: {
            description: 'The name of the command to search for.',
            required: false
        }
    },
    isAdmin: false
}
