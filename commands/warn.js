const discord = require('discord.js')
const mysql = require('mysql')
const config = require('../config.json')

exports.run = (client, message, args, adminRole, logChannel, con) => {
    function warnUser(user, dbRes, reason) {
        con.query(`UPDATE users SET times_warned = '${(dbRes.times_warned + 1).toString()}' WHERE uid='${user.user.id}'`, (err, res) => {
            if (err) {
                client.emit('error', err)
                return message.channel.send({
                    embed: {
                        description: `Something went wrong :(`,
                        color: 1409939
                    }
                })
            } else {
                message.channel.send({
                    embed: {
                        description: `Warned **${user.user.username}#${user.user.discriminator}** ${
                            (reason && reason != '')
                                ? `for \`${reason
                                    .replace(/{{ *prefix *}}/g, config.settings.prefix)
                                    .replace(/{{ *site *}}/g, config.settings.site)
                                    .replace(/{{ *name *}}/g, client.user.username)
                                    .replace(/{{ *s(erver)?name *}}/g, message.guild.name)
                                    .replace(/{{ *maxwarns *}}/g, config.settings.max_warns)
                                    .replace(/{{ *timemuted *}}/g, config.settings.time_muted)}\``
                                : ''
                        } for the **${dbRes.times_warned + 1}**th time.`,
                        color: 1409939,
                        footer: {
                            text: `© Copyright Streampy Hosting - ${new Date().getFullYear()}`
                        }
                    }
                })
                var msg = {
                    embed: {
                        title: 'You have been warned!',
                        description: `You have been warned by: **${message.author.tag}**!`,
                        color: 1409939,
                        footer: {
                            text: `© Copyright Streampy Hosting - ${new Date().getFullYear()}`
                        },
                        fields: [{
                            name: `Times warned:`,
                            value: `You have been warned \`${dbRes.times_warned + 1}\` times. After **${config.settings.max_warns}** times you will be muted for **${config.settings.time_muted}** hours.`
                        }]
                    }
                }

                if (reason && reason != '')
                    msg.embed.fields.push({
                        name: `Reason:`,
                        value: reason
                    })
                
                user.user.send(msg)

                // TODO: als persoon 5+ keer gewarned is, mute persoon :)
            }
        })
    }

    message.delete()

    if (message.member.roles.has(adminRole.id)) {
        if (!args[0] || !args[0].match(/(<@)?[0-9]>?/)) {
            return message.channel.send({
                embed: {
                    description: `Warn usage: \`${config.settings.prefix}warn <user> [reason]\``,
                    color: 1409939,
                    footer: {
                        text: `© Copyright Streampy Hosting - ${new Date().getFullYear()}`
                    }
                }
            })
        } else {
            var userID = args[0]
                .replace('<@', '')
                .replace('>', '')
            var user = message.guild.members.find(u => u.id == userID)

            var reason = message.content
                .replace(`${config.settings.prefix}warn`, '')
                .replace(/(<@)?[0-9]+>?/, '')
                .trim()

            if (!user) return message.channel.send({
                embed: {
                    description: `No user with id **"${userID}"** found on this server.`,
                    color: 1409939,
                    footer: {
                        text: `© Copyright Streampy Hosting - ${new Date().getFullYear()}`
                    }
                }
            })

            con.query(`SELECT * FROM users WHERE uid=${user.user.id}`, (err, res) => {
                if (err) {
                    client.emit('error', err)
                    return message.channel.send({
                        embed: {
                            description: `Something went wrong :(`,
                            color: 1409939
                        }
                    })
                } else {
                    if (res.length > 0)
                        warnUser(user, res[0], reason)
                    else {
                        con.query(`INSERT INTO users (uid, times_warned, times_muted, times_kicked) VALUES ('${user.user.id}', '0', '0', '0')`, (err, res) => {
                            if (err) {
                                client.emit('error', err)
                                return message.channel.send({
                                    embed: {
                                        description: `Something went wrong :(`,
                                        color: 1409939
                                    }
                                })
                            } else {
                                con.query(`SELECT * FROM users WHERE uid=${user.user.id}`, (err, res) => {
                                    if (err) {
                                        client.emit('error', err)
                                        return message.channel.send({
                                            embed: {
                                                description: `Something went wrong :(`,
                                                color: 1409939
                                            }
                                        })
                                    } else
                                        warnUser(user, res[0], reason)
                                })
                            }
                        })
                    }
                }
            })
        }
    }
}

exports.help = {
    name: 'Warn',
    description: 'Get a list of commands in your PM.',
    command: 'warn',
    usage: '{{ prefix }}warn <user> [reason]',
    params: {
        user: {
            description: 'Warn an user. {{ maxwarns }}+ warns result in a mute for {{ timemuted }} hours.',
            required: true
        },
        reason: {
            description: 'The reason for warning the user.',
            required: false
        }
    },
    isAdmin: true
}
