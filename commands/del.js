const discord = require('discord.js')
const config = require('../config.json')

exports.run = (client, message, args, adminRole) => {
    message.delete()

    if (message.member.roles.has(adminRole.id) && message.channel.name.match(/ticket_[0-9]+/)) {

        if (!args[0] || !args[0].match(/(<@)?[0-9]+>?/)) return message.channel.send({
            embed: {
                title: 'Remove user',
                description: `Make sure you use this command in a ticket channel!\nDel user usage: \`${config.settings.prefix}del <user>\``,
                color: 1409939,
                footer: {
                    text: `© Copyright Streampy Hosting - ${new Date().getFullYear()}`
                }
            }
        })

        var userID = args[0]
            .replace('<@', '')
            .replace('>', '')
        var user = message.guild.members.find(u => u.id == userID)

        if (!user) return message.channel.send({
            embed: {
                description: `No user with id **"${userID}"** found on this server.`,
                color: 1409939,
                footer: {
                    "text": `© Copyright Streampy Hosting - ${new Date().getFullYear()}`
                }
            }
        })

        message.channel.overwritePermissions(user.id, {
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false,
            ATTACH_FILES: false,
            del_REACTIONS: false,
            EMBED_LINKS: false,
            READ_MESSAGE_HISTORY: false,
            USE_EXTERNAL_EMOJIS: false
        }).then(updated => message.channel.send({
            embed: {
                description: `Succesfully removed **${user.user.username}#${user.user.discriminator}** from the channel.`,
                color: 1409939,
                footer: {
                    text: `Requested by: ${message.author.tag} - © Copyright Streampy Hosting - ${new Date().getFullYear()}`
                }
            }
        }))
    }
}

exports.help = {
    name: 'Remove user',
    description: 'Remove an user to a ticket channel.',
    command: 'del',
    usage: '{{ prefix }}del <user>',
    params: {
        user: {
            description: 'The user to remove to the channel.',
            required: true
        }
    },
    isAdmin: true
}
