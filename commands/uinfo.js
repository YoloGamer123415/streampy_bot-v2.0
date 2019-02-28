const discord = require('discord.js')
const mysql = require('mysql')
const config = require('../config.json')

var insults = [
    //'Don’t feel bad, there are many people who have no talent!',
    //'As an outsider, what do you think of the human race?',
    'I’d like to kick him in the teeth, but why should I improve his looks?',
    'At least there’s one thing good about his body – it’s not as ugly as his face.',
    'Brains aren’t everything. In fact, in his case they’re nothing.',
    'I like him. People say I’ve no taste, but I like him.',
    'Did his parents ever ask him to run away from home?',
    'If I had a face like his I’d sue my parents.',
    'Any similarity between him and a human is purely coincidental.',
    'Keep talking – someday he’ll say something intelligent.',
    //'Don’t you love nature, despite what it did to you?',
    //'Don’t think, it might sprain your brain.',
    'Fellows like him don’t grow from trees, they swing from them.',
    //'He has a mechanical mind. Too bad he forgot to wind it up this morning.',
    'he’s a man of the world. And you know what sad shape the world is in.',
    'He’s always lost in thought. It’s unfamiliar territory.',
    'Is he always so stupid or is today a special occasion?',
    'He’s listed in Who’s Who as What’s That?',
    'He’s living proof that man can live without a brain.',
    'He’s so short, when it rains he’s always the last to know.',
    'He’s the kind of a man you’d use as a blueprint to build an idiot.',
    'How did he get here? Did someone leave his cage open?',
    'How much refund does he expect on his head now it’s empty?',
    //'How would you like to feel the way you look?',
    'Hi, I’m a human being. What are you?',
    //'I can’t talk to you right now. Where will you be 10 years from now?',
    'I don’t want him to turn the other cheek, it’s just as ugly.',
    'I don’t know what it is that makes him so stupid but it really works.',
    'I could make a monkey out of him, but why should I take all the credit?',
    'I can’t seem to remember his name, and please don’t help me.',
    //'I’ve seen people like you but I had to pay admission.',
    'Does he practise being this ugly?',
]

exports.run = (client, message, args, adminRole, logChannel, con) => {
    message.delete()

    if (message.member.roles.has(adminRole.id)) {if (!args[0] || !args[0].match(/(<@)?[0-9]+>?/)) return message.channel.send({
            embed: {
                description: `User Info usage: \`${config.settings.prefix}uinfo <user>\``,
                color: 1409939,
                footer: {
                    "text": `© Copyright Streampy Hosting - ${new Date().getFullYear()}`
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

        con.query(`SELECT * FROM users WHERE uid = ${message.author.id}`, (err, res) => {
            if (err) return message.channel.send({
                embed: {
                    title: 'Error!',
                    description: `Something bad happend :|\n\n\`\`\`${err}\`\`\``,
                    color: 1409939,
                    footer: {
                        text: `This message will be deleted in 15 seconds.`
                    }
                }
            }).then(msg => setTimeout(() => msg.delete(), 15000))
            else {
                console.log(res)

                message.channel.send({
                    "embed": {
                        "title": "User Info",
                        "description": insults[Math.round(Math.random() * (insults.length - 1))],
                        "color": 1409939,
                        "footer": {
                            "text": `Requested by: ${message.author.tag} - © Copyright Streampy Hosting - ${new Date().getFullYear()}`
                        },
                        "thumbnail": {
                            "url": user.avatarURL ? user.avatarURL : 'https://cdn.discordapp.com/embed/avatars/0.png'
                        },
                        "fields": [{
                            "name": "Username",
                            "value": user.username
                        }, {
                            "name": "Discriminator",
                            "value": user.discriminator
                        }, {
                            "name": "Tag",
                            "value": user.tag
                        }, {
                            "name": "Id",
                            "value": `${user.id}`
                        }, {
                            "name": "Is a bot",
                            "value": user.bot
                        }, {
                            "name": "Created at",
                            "value": user.createdAt
                        }, {
                            "name": "Times warned",
                            "value": `5`
                        }, {
                            "name": "Times muted",
                            "value": `3`
                        }, {
                            "name": "Times kicked",
                            "value": `*The user has not been kicked (yet).*`
                        }]
                    }
                })
            }
        })
    }
}

exports.help = {
    name: 'User info',
    description: 'Get all of the handy info from an user.',
    command: 'uinfo',
    usage: '{{ prefix }}uinfo <user>',
    params: {
        user: {
            description: 'The id or tag of the user.',
            required: true
        }
    },
    isAdmin: true
}
