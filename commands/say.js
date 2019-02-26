const discord = require('discord.js')
const config = require('../config.json')

exports.run = (client, message, args, adminRole) => {
    message.delete()
    if (message.member.roles.has(adminRole.id) && args[0]) {
        var msg = message.content.replace(`${config.prefix}say`).trim()
        var title = msg.split('||')[0].trim()
        var text = msg.split('||')[1].trim()
        var channel = message.guild.channels.find(c => c.name.toLowerCase().match(/announcement/))

        if (text == '') return message.channel.send({
            "embed": {
                "description": `Please specify some text for me to say.\nSay usage: \`${config.prefix}say [title] || <text>\``,
                "color": 1409939,
                "footer": {
                    "text": `© Copyright Streampyhosting - ${new Date().getFullYear()}`
                }
            }
        })

        var embed_msg = {
            description: text,
            color: 1409399,
            footer: {
                text: `© Copyright Streampyhosting - ${new Date().getFullYear()} - Send by: ${message.author.tag}`
            }
        }

        if (title != '')
            embed_msg['title'] = title

        message.channel.send
    }
}

exports.help = {
    name: 'Say',
    description: 'Send a message in embed form via the bot to the announcement channel. After that, send a @everyone.',
    command: 'say',
    usage: '{{ prefix }}say [title] || <message>',
    params: {
        title: {
            description: 'The title for the embed.',
            required: false
        },
        "||": {
            description: 'This separates the title from the text, do **not** forget it.',
            required: true
        },
        message: {
            description: 'The text for the embed.',
            required: true
        }
    },
    isAdmin: false
}
