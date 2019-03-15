const discord = require('discord.js')
const config = require('../config.json')

exports.run = (client, message, args, adminRole) => {
    message.delete()
    if (message.member.roles.has(adminRole.id)) {
        if (!args[0]) return message.channel.send({
            "embed": {
                "description": `Please specify some text for me to say.\nSay usage: \`${config.settings.prefix}say [title] || <text>\``,
                "color": 1409939,
                "footer": {
                    "text": `© Copyright Streampy Hosting - ${new Date().getFullYear()}`
                }
            }
        })  

        var msg = message.content.replace(`${config.settings.prefix}say`, '').trim()

        if (msg == '' || !msg.match(/\|\|/g)) return message.channel.send({
            "embed": {
                "description": `Please specify some text for me to say.\nSay usage: \`${config.settings.prefix}say [title] || <text>\``,
                "color": 1409939,
                "footer": {
                    "text": `© Copyright Streampy Hosting - ${new Date().getFullYear()}`
                }
            }
        })

        var title = msg.split('||')[0].trim()
            .replace(/{{ *prefix *}}/g, config.settings.prefix)
            .replace(/{{ *site *}}/g, config.settings.site)
            .replace(/{{ *name *}}/g, client.user.username)
            .replace(/{{ *s(erver)?name *}}/g, message.guild.name)
        var text = msg.split('||')[1].trim()
            .replace(/{{ *prefix *}}/g, config.settings.prefix)
            .replace(/{{ *site *}}/g, config.settings.site)
            .replace(/{{ *name *}}/g, client.user.username)
            .replace(/{{ *s(erver)?name *}}/g, message.guild.name)
        var channel = message.guild.channels.find(c => c.name.toLowerCase().match(/announcement/))

        if (text == '') return message.channel.send({
            "embed": {
                "description": `Please specify some text for me to say.\nSay usage: \`${config.settings.prefix}say [title] || <text>\``,
                "color": 1409939,
                "footer": {
                    "text": `© Copyright Streampy Hosting - ${new Date().getFullYear()}`
                }
            }
        })

        var embed_msg = {
            description: text,
            color: 1409939,
            footer: {
                text: `Send by: ${message.author.tag} - © Copyright Streampy Hosting - ${new Date().getFullYear()}`
            }
        }

        if (title != '')
            embed_msg['title'] = title

        channel.send({ embed: embed_msg })
        channel.send('@everyone').then(msg => msg.delete())
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
    isAdmin: true
}
