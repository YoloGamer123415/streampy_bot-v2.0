const discord = require('discord.js')
const config = require('../config.json')

exports.run = (client, message, args, adminRole) => {
    message.delete()
    if (message.member.roles.has(adminRole.id)) {
        var msg = message.content.replace(`${config.prefix}alert`, '').trim()

        if (msg == '' || msg == undefined || msg == null) return message.channel.send({
            embed: {
                description: `Maybe you need to specify something for me to say... 🤦‍`,
                color: 1409939,
                footer: {
                    text: `© Copyright Streampyhosting - ${new Date().getFullYear()}`
                }
            }
        })

        var channel = message.guild.channels.find(c => c.name.toLowerCase().match(/announcement/))
        if (!channel)
            return message.channel.send({
                embed: {
                    description: `Maybe you need an announcement channel... 🤦‍`,
                    color: 1409939,
                    footer: {
                        text: `© Copyright Streampyhosting - ${new Date().getFullYear()}`
                    }
                }
            })
        else {
            channel.send(msg).catch(e => {
                client.emit('error', e)
                console.error(e)
            })
        }
    }
}

exports.help = {
    name: 'Alert',
    description: 'Send a message via the bot to the announcement channel.',
    command: 'alert',
    usage: '{{ prefix }}alert <message>',
    params: {
        message: {
            description: 'The message to be send in the announcement channel.',
            required: true
        }
    },
    isAdmin: true
}
