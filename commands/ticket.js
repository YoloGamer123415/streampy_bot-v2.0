const discord = require('discord.js')
const config = require('../config.json')
const fs = require('fs')

exports.run = (client, message, args, adminRole) => {
    message.delete()

    fs.readFile('./tickets.txt', { encoding: 'UTF-8' }, (err, d) => {
        if (err) {
            console.error(err)
            return message.channel.send({
                "embed": {
                    "description": "Something went wrong.",
                    "color": 1409939,
                    "footer": {
                        "text": `© Copyright Streampyhosting - ${new Date().getFullYear()}`
                    }
                }
            })
        } else {
            const channel_name = `ticket_${d.toString().padStart(4, '0')}`
            const allowedPersonID = message.author.id
            const allowedAdminID = adminRole.id
            const nlRole = message.guild.roles.find(r => r.name.toLowerCase().match(/nl/))
            const userHasRole = message.member.roles.has(nlRole.id)

            message.guild.createChannel(channel_name, 'text', [{
                id: message.guild.id,
                deny: 1024
            }, {
                id: allowedPersonID,
                allow: 511040
            }, {
                id: allowedAdminID,
                allow: 8
            }]).then(channel => {
                //channel.setParent('527421636132208640')
                channel.send({
                    embed: {
                        title: channel.name,
                        description: userHasRole ? `In dit kanaal kan je de admins vragen stellen.` : `In this channel you can ask the moderators questions.`,
                        color: 1409939,
                        fields: [{
                            name: userHasRole? 'Gebruiker' : 'User',
                            value: `<@${message.author.id}>`,
                            inline: true
                        }, {
                            name: userHasRole? 'Vraag' : 'Question',
                            value: args[0] ? message.content.slice(config.prefix.length).trim().replace('ticket', '').toString() : `*${userHasRole ? 'Geen vraag opgegeven...' : 'No question given...'}*`,
                            inline: true
                        }, {
                            name: userHasRole ? 'Wachten' : 'Waiting',
                            value: userHasRole ? `Het kan zijn dat het even duurt voordat wij, de admins van **${message.guild.name}**, bij je komen.` : `It may be that it takes a little while until we, the admins of **${message.guild.name}**, get to you.`
                        }],
                        footer: {
                            text: `© Copyright Streampyhosting - ${new Date().getFullYear()}`
                        }
                    }
                })
                message.channel.send({
                    embed: {
                        description: `The channel **<#${channel.id}>** has been created for you!`,
                        color: 1409939,
                        footer: {
                            text: `© Copyright Streampyhosting - ${new Date().getFullYear()}`
                        }
                    }
                })

                const toWrite = (parseInt(d) + 1).toString()
                fs.writeFile('./tickets.txt', toWrite, err => {
                    if (err)
                        console.error(err)
                })
            }).catch(e => {
                console.error(e)
                message.channel.send({
                    embed: {
                        title: `Ticket`,
                        description: `Something went wrong while creating your private channeln`,
                        color: 1409939,
                        footer: {
                            text: `© Copyright Streampyhosting - ${new Date().getFullYear()}`
                        }
                    }
                })
            })
        }
    })
}

exports.help = {
    name: 'Ticket',
    description: 'Make a ticket channel to ask things to the admins.',
    command: 'ticket',
    usage: '{{ prefix }}ticket [question]',
    params: {
        question: {
            description: 'The question to be answered.',
            required: false
        }
    },
    isAdmin: false
}
