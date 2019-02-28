const discord = require('discord.js')
const config = require('../config.json')

exports.run = (client, message, args, adminRole) => {
    message.delete()

    if (message.member.roles.has(adminRole.id) && message.channel.name.match(/ticket_[0-9]+/)) {

        if (!args[0] || !args[0].match(/(<@)?[0-9]+>?/)) return message.channel.send({
            embed: {
                title: 'Add user',
                description: `Make sure you use this command in a ticket channel!\nAdd user usage: \`${config.settings.prefix}add <user>\``,
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
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            ATTACH_FILES: true,
            ADD_REACTIONS: true,
            EMBED_LINKS: true,
            READ_MESSAGE_HISTORY: true,
            USE_EXTERNAL_EMOJIS: true
        }).then(updated => message.channel.send({
            embed: {
                description: `Succesfully added **${user.user.username}#${user.user.discriminator}** to the channel.`,
                color: 1409939,
                footer: {
                    text: `Requested by: ${message.author.tag} - © Copyright Streampy Hosting - ${new Date().getFullYear()}`
                }
            }
        }))
    }
}

exports.help = {
    name: 'Add user',
    description: 'Add an user to a ticket channel.',
    command: 'add',
    usage: '{{ prefix }}add <user>',
    params: {
        user: {
            description: 'The user to add to the channel.',
            required: true
        }
    },
    isAdmin: true
}
