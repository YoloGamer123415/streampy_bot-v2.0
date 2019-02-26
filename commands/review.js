const discord = require('discord.js')
const config = require('../config.json')

exports.run = (client, message, args) => {
    if (args[0] && args[0].match(/[1-5]/) && parseInt(args[0]) > 0 && parseInt(args[0]) <= 5) {
        var msg = {
            embed: {
                title: 'Review',
                description: `**${message.author.tag}** has send a review about **${message.guild.name}**!`,
                color: 1409939,
                fields: [],
                footer: {
                    text: `© Copyright Streampyhosting - ${new Date().getFullYear()}`
                }
            }
        }

        var rating = ''
        for (var i = 0; i < parseInt(args[0]); i++) rating += '⭐'

        msg.embed.fields.push({
            name: 'Stars',
            value: `${rating}`,
            inline: true
        })

        if (args[1]) {
            var review = message.content.slice(config.prefix.length).trim().replace(`review`, '').replace(/[1-5] +/, '')

            if (review.length < 1000) {
                msg.embed.fields.push({
                    name: 'Message',
                    value: review.toString(),
                    inline: true
                })
            } else {
                return message.channel.send({
                    "embed": {
                        "title": "Review",
                        "description": `Your review is a bit to long (**${review.length}** characters), please reduce it to **1000** or less.`,
                        "color": 1409939,
                        "footer": {
                            "text": `© Copyright Streampyhosting - ${new Date().getFullYear()}`
                        }
                    }
                })
            }
        }

        message.guild.channels.find(c => c.name.toLowerCase().match(/review/)).send(msg)
        message.delete()
        message.channel.send({
            "embed": {
                "title": "Review",
                "description": `Thanks **${message.author.username}** for your review, it has been send in the <#${message.guild.channels.find(channel => channel.name.toLowerCase().match(/review/)).id}> channel!`,
                "color": 1409939,
                "footer": {
                    "text": `© Copyright Streampyhosting - ${new Date().getFullYear()}`
                }
            }
        })
    } else {
        message.channel.send({
            "embed": {
                "title": "Review",
                "description": "Review usage: `+review <1-5> [review]`",
                "color": 1409939,
                "footer": {
                    "text": `© Copyright Streampyhosting - ${new Date().getFullYear()}`
                }
            }
        })
    }
}

exports.help = {
    name: 'Review',
    description: 'Send a review about **{{ sname }}**.',
    command: 'review',
    usage: '{{ prefix }}review <1-5> [message]',
    params: {
        '1-5': {
            description: 'The total of stars to give.',
            required: true
        },
        message: {
            description: 'The review message to send.',
            required: false
        }
    },
    isAdmin: false
}
