const discord = require('discord.js')
const config = require('../config.json')
const fs =require('fs')
const path = require('path')

exports.run = (client, message, args, adminRole) => {
    var sendTo = message.channel
    var channel

    if (message.channel.name.match(/ticket_[0-9]+/)) {
        if (args[0] && args[0].match(/(<@)?[0-9]+>?/)) {
            var userID = args[0]
                .replace('<@', '')
                .replace('>', '')
            sendTo = message.guild.members.find(u => u.id == userID)
        } else if (args[0] && args[0].toLowerCase() == 'here') {
            sendTo = message.channel
        }

        channel = message.channel
    } else {
        if (
            !args[1] ||
            args[1] == '' ||
            !args[1].match(/(<#)?[0-9]+>?/)
        ) return message.channel.send({
            embed: {
                description: `Please specify a ticket channel or send the message in a ticket.\nTranscript usage: \`${config.settings.prefix}transcript [user] [channel]\``,
                color: 1409939,
                footer: {
                    text: `© Copyright Streampy Hosting - ${new Date().getFullYear()}`
                }
            }
        })

        var channelID = args[1]
            .replace('<#', '')
            .replace('>', '')
        
        var chan = message.guild.channels.find(c => c.id == channelID)
        if (!chan) return message.channel.send({
            embed: {
                description: `No channel with id **${channelID}** found on this server.`,
                color: 1409939,
                footer: {
                    text: `© Copyright Streampy Hosting - ${new Date().getFullYear()}`
                }
            }
        })

        channel = chan

        if (args[0] && args[0].match(/(<@)?[0-9]+>?/)) {
            var userID = args[0]
                .replace('<@', '')
                .replace('>', '')
            sendTo = message.guild.members.find(u => u.id == userID)
        } else if (args[0] && args[0].toLowerCase() == 'here') {
            sendTo = message.channel
        }
    }

    if (
        message.member.roles.has(adminRole.id) ||
        (
            channel.permissionsFor(message.author) &&
            channel.permissionsFor(message.author).has('READ_MESSAGE_HISTORY')
        )
    ) {
        if (fs.existsSync(`./tickets/${channel.name}.txt`)) {
            sendTo.send({
                embed: {
                    description: `Your requested transcript from channel **${channel.name}**.`,
                    color: 1409939,
                    footer: {
                        text: `© Copyright Streampy Hosting - ${new Date().getFullYear()}`
                    }
                },
                files: [{
                    attachment: path.join(
                        __dirname,
                        '../',
                        'tickets',
                        `${channel.name}.txt`
                    ),
                    name: `${channel.name}.txt`
                }]
            }).then(msg => {
                message.react('👌').then(() => setTimeout(() => message.delete(), 3000))
            }).catch(err => {
                client.emit('error', err)
                return message.channel.send({
                    embed: {
                        description: `Something bad happend :(`,
                        color: 1409939,
                        footer: {
                            text: `© Copyright Streampy Hosting - ${new Date().getFullYear()}`
                        }
                    }
                })
            })
        }
    } else return message.channel.send({
        embed: {
            description: `You don't have permission to view the channel **${channel.name}**.`,
            color: 1409939,
            footer: {
                text: `© Copyright Streampy Hosting - ${new Date().getFullYear()}`
            }
        }
    })
}

exports.help = {
    name: 'Transcript',
    description: 'Get a copy of a ticket send to you.',
    command: 'transcript',
    usage: '{{ prefix }}transcript [user] [channel]',
    params: {
        user: {
            description: 'The user to send the transcript to. Use *here* for the channel the message is send in. Defaults to the channel the message is send in.',
            required: false
        },
        channel: {
            description: 'The ticket channel for the transcript. If you send the command in a ticket channel, it will be that channel.',
            required: false
        }
    },
    isAdmin: false
}
