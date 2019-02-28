const discord = require('discord.js')
const config = require('../config.json')

exports.run = (client, message, args, adminRole) => {
    if (message.member.roles.has(adminRole.id)) {
        var msg = message.content.replace(`${config.settings.prefix}send`, '').trim()

        if (
            !args[0] ||
            args[0] == '' ||
            !args[0].match(/(<@)?[0-9]+>?/) ||
            !args[1] ||
            args[1] == ''
        ) return message.channel.send({
            "embed": {
                "description": `Send usage: \`${config.settings.prefix}send <user-tag | user-id> <message> [embed=true/false]\``,
                "color": 1409939,
                "footer": {
                    "text": `© Copyright Streampy Hosting - ${new Date().getFullYear()}`
                }
            }
        })

        var userID = args[0]
            .replace('<@', '')
            .replace('>', '')
        var user = message.guild.members.find(u => parseInt(u.id) == parseInt(userID))

        if (!user) return message.channel.send({
            embed: {
                description: `No user with id **"${userID}"** found on this server!`,
                color: 1409939,
                "footer": {
                    "text": `© Copyright Streampy Hosting - ${new Date().getFullYear()}`
                }
            }
        })

        msg = msg.replace(/(<@)?[0-9]+>? +/, '')

        var end_msg

        if (msg.match(/(embed=true)$/)) {
            end_msg = {
                embed: {
                    description: msg.replace(/(embed=true)$/, ''),
                    color: 1409939,
                    footer: {
                        text: `Send by: ${message.author.tag} - © Copyright Streampy Hosting - ${new Date().getFullYear()}`
                    }
                }
            }
        } else {
            end_msg = `${msg
                .replace(/(embed=[a-zA-Z]+)$/, '')
                .trim()}\n\n\`Send by: ${message.author.tag}\``
        }

        user.send(end_msg)
        message.react('👌').then(() => setTimeout(() => message.delete(), 3000))
    } else
        message.delete()
}

exports.help = {
    name: 'Send',
    description: 'Send a message to an user in PM via the bot.',
    command: 'send',
    usage: '{{ prefix }}send <user-tag | user-id> <message> [embed=true/false]',
    params: {
        'user-tag | user-id': {
            description: 'The user-tag or user-id from the user.',
            required: true
        },
        message: {
            description: 'The message to be send to the user.',
            required: true
        },
        embed: {
            description: 'If the message needs to be in embed form. Defaults to false',
            required: false
        }
    },
    isAdmin: true
}
