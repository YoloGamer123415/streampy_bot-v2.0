const discord = require('discord.js')
const config = require('../config.json')

exports.run = (client, message, args) => {
    if (args[0]) {
        var channel = message.guild.channels.find(c => c.name.toLowerCase().match(/suggestion/))
        channel.send({
            "embed": {
                "title": "Suggestion",
                "description": `${message.content.replace(`${config.prefix}suggest`, '').trim()}`,
                "color": 1409939,
                "footer": {
                    "text": `© Copyright Streampyhosting - ${new Date().getFullYear()}`
                },
                "fields": [{
                    "name": "Suggested by:",
                    "value": `<@${message.author.id}>`
                }]
            }
        }).then(msg => {
            msg.react('👍')
            msg.react('👎')
            message.react('👌').then(() => setTimeout(() => message.delete(), 3000))
        })
    } else {
        message.channel.send({
            "embed": {
                "title": "Suggest",
                "description": "Suggest usage: `+suggest <suggestion>`",
                "color": 1409939,
                "footer": {
                    "text": `© Copyright Streampyhosting - ${new Date().getFullYear()}`
                }
            }
        })
        message.delete()
    }
}

exports.help = {
    name: 'Suggestion',
    description: 'Send your suggestion to the #suggestions channel.',
    command: 'suggest',
    usage: '{{ prefix }}suggest <suggestion>',
    params: {
        suggestion: {
            description: 'The name of the command to search for.',
            required: true
        }
    },
    isAdmin: false
}
