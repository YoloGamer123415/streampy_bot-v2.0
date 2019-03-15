const discord = require('discord.js')
const config = require('../config.json')
const ms = require('ms')

exports.run = (client, message, args, adminRole, logChannel) => {
    if (message.member.roles.has(adminRole.id)) {
        message.channel.send(`A giveaway huh? And where should this happen?\n\n\`Please type the name of the channel.\``)
            .then(channel_msg => {
                message.channel.awaitMessages(res => res.author.id == message.author.id, {
                    max: 1,
                    time: 20000,
                    errors: ['time']
                })
                .then(collected_channel => {
                    var chanID = collected_channel.first().content
                        .replace('<@', '')
                        .replace('>', '')
                        .trim()
                    var chan = message.guild.channels.find(c => c.id == chanID)
                    if (!chan) return message.channel.send(`There is no channel in this server with the id **${chanID}**...`)
                        .then(msg => {
                            setTimeout(() => {
                                message.delete()
                                collected_channel.first().delete()
                                channel_msg.delete()
                                msg.delete()
                            }, 20000)
                        })
                    
                    message.channel.send(`Alright, **${chan.toString()}** it is! But how long should the giveaway last?\n\n\`Enter a duration in seconds, a duration in minutes with a m behind, or a duration in days with a d behind.\``)
                        .then(duration_msg => {
                            message.channel.awaitMessages(res => res.author.id == message.author.id, {
                                max: 1,
                                time: 20000,
                                errors: ['time']
                            })
                            .then(collected_duration => {
                                if (collected_duration.first().content.match(/[0-9]+(s|m|d)?/)) {
                                    var lengthMS = ms(`${collected_duration.first().content.trim()}`)

                                    var lengthREADABLE = collected_duration.first().content.trim()
                                    if (collected_duration.first().content.match(/[0-9]+s/))
                                        lengthREADABLE = lengthREADABLE.replace('s', ' seconds')
                                    else if (collected_duration.first().content.match(/[0-9]+m/))
                                        lengthREADABLE = lengthREADABLE.replace('m', ' minutes')
                                    if (collected_duration.first().content.match(/[0-9]+d/))
                                        lengthREADABLE = lengthREADABLE.replace('d', ' days')

                                    if (lengthMS) {
                                        message.channel.send(`Great, the giveaway will last **${lengthREADABLE}**. And how many winners should there be?\n\n\`There can be 1 to 10 winners\``)
                                            .then(winners_messsage => {
                                                message.channel.awaitMessages(res => res.author.id == message.author.id, {
                                                    max: 1,
                                                    time: 20000,
                                                    errors: ['time']
                                                })
                                                .then(collected_winners => {
                                                    // TODO: ga verder :)
                                                })
                                                .catch(() => message.channel.send(`Faster! The giveaway was cancelled.`).then(msg => {
                                                    setTimeout(() => {
                                                        message.delete()
                                                        channel_msg.delete()
                                                        duration_msg.delete()
                                                        winners_messsage.delete()
                                                        msg.delete()
                                                    }, 20000)
                                                }))
                                            })
                                    } else return message.channel.send(`The given timeformat does not match the expected timeformat.`)
                                        .then(msg => {
                                            setTimeout(() => {
                                                message.delete()
                                                collected_channel.first().delete()
                                                collected_duration.first().delete()
                                                channel_msg.delete()
                                                duration_msg.delete()
                                                msg.delete()
                                            }, 20000)
                                        })
                                } else return message.channel.send(`The given timeformat does not match the expected timeformat.`)
                                    .then(msg => {
                                        setTimeout(() => {
                                            message.delete()
                                            collected_channel.first().delete()
                                            collected_duration.first().delete()
                                            channel_msg.delete()
                                            duration_msg.delete()
                                            msg.delete()
                                        }, 20000)
                                    })
                            })
                            .catch(() => message.channel.send(`Faster! The giveaway was cancelled.`).then(msg => {
                                setTimeout(() => {
                                    message.delete()
                                    channel_msg.delete()
                                    duration_msg.delete()
                                    msg.delete()
                                }, 20000)
                            }))
                        })
                })
                .catch(() => message.channel.send(`Faster! The giveaway was cancelled.`).then(msg => {
                    setTimeout(() => {
                        message.delete()
                        channel_msg.delete()
                        msg.delete()
                    }, 20000)
                }))
            })
    }
}

exports.help = {
    name: 'Create Giveaway',
    description: 'Start a giveaway.',
    command: 'giveaway',
    usage: '{{ prefix }}giveaway',
    params: null,
    isAdmin: true
}
