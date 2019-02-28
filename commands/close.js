const discord = require('discord.js')

exports.run = (client, message, args, adminRole) => {
    message.delete()

    if (message.member.roles.has(adminRole.id) && message.channel.name.match(/ticket_[0-9]+/)) {
        message.channel.send({
            "embed": {
                "description": `Are you sure you want to close **${message.channel.name}**?\n\n\`\`\`Answer with ✅ or ❎\`\`\``,
                "color": 1409939,
                "footer": {
                    "text": `© Copyright Streampy Hosting - ${new Date().getFullYear()}`
                }
            }
        }).then(msg => {
            msg.react('✅')
            msg.react('❎')

            const allowFilter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id
            const denyFilter = (reaction, user) => reaction.emoji.name === '❎' && user.id === message.author.id

            const allow = msg.createReactionCollector(allowFilter, { time: 10000 })
            const deny = msg.createReactionCollector(denyFilter, { time: 10000 })

            allow.on('collect', r => {
                msg.edit({
                    "embed": {
                        "description": "K bye!",
                        "color": 1409939
                    }
                })
                setTimeout(() => {
                    message.channel.delete()
                    clearTimeout(timer)
                }, 200)
            })
            deny.on('collect', r => {
                msg.edit({
                    "embed": {
                        "description": "Not deleting the channel!",
                        "color": 1409939
                    }
                }).then(m => setTimeout(() => {
                    m.delete()
                    clearTimeout(timer)
                }, 5000))
            })

            var timer = setTimeout(() => {
                msg.edit({
                    "embed": {
                        "description": `Too slow 😝`,
                        "color": 1409939,
                        "footer": {
                            "text": `© Copyright Streampy Hosting - ${new Date().getFullYear()}`
                        }
                    }
                }).then(setTimeout(() => msg.delete(), 400))
            }, 10000)
        })
    }
}

exports.help = {
    name: 'Close',
    description: 'Close the ticket you send the message in.',
    command: 'close',
    usage: '{{ prefix }}close',
    params: null,
    isAdmin: true
}
