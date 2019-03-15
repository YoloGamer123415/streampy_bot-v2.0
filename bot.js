const mysql = require('mysql')
const discord = require('discord.js')
const client = new discord.Client()
const fs = require('fs')
var config = require('./config.json')
const secret = require('./secret.json')
client.commands = new discord.Collection()

const twit = require('twit')
const T = new twit({
    consumer_key: secret.twitter.consumer_key,
    consumer_secret: secret.twitter.consumer_secret,
    access_token: secret.twitter.access_token,
    access_token_secret: secret.twitter.access_token_secret
})
/*
var tweets = T.stream('statuses/filter', {
    follow: 1073572056883712000
})
tweets.on('tweet', tweet => {
    if (tweet && tweet.id_str && tweet.text) {
        var msg = {
            embed: {
                description:  `[Streampy Hosting has send a new Tweet!](https://twitter.com/StreampyH/status/${tweet.id_str})`,
                url: `https://twitter.com/StreampyH/status/${tweet.id_str}`,
                color: 1409939,
                footer: {
                    text: `© Copyright Streampy Hosting - ${new Date().getFullYear()}`
                },
                fields: [{
                    name: 'Tweet:',
                    value: `${tweet.text}`
                }, {
                    name: `View the tweet on twitter:`,
                    value: `https://twitter.com/StreampyH/status/${tweet.id_str}`
                }]
            }
        }

        try {
            if (client.guilds.get('498217741166313472')) {
                var channel = client.guilds.get('498217741166313472').channels.find(c => c.name.toLowerCase().match(/tweet/))
                if (channel)
                    channel.send(msg)
                else {
                    console.error(`No tweet channel found`)
                }
            }
        } catch (e) {
            throw e
        }
    }
})
*/
var con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    database: 'Streampy'
})

con.connect(err => {
    if (err)
        throw err
    else {
        console.log(`Database:\t\tConnected`)
    }
})

function formatBytes(a,b){if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]}

fs.readdir('./commands/', (err, files) => {
    if (err)
        console.error(err)
    else {
        var js_files = files.filter(f => f.split('.').pop() === 'js')

        if (js_files.length <= 0) {
            console.error(`No command files found!`)
            return
        }

        js_files.forEach(f => {
            var file = require(`./commands/${f}`)
            console.log(`Loading command:\t${config.settings.prefix + f.replace('.js', '')}`)

            client.commands.set(file.help.command, file)
        })

        console.log(`Loaded commands:\t${js_files.length}`)
    }
})

client.on('error', error => {
    function pad(str, num = 2) {
        return str.toString().padStart(num, '0')
    }

    const d = new Date()
    var time = `${pad(d.getDate())} ${pad(d.getMonth() + 1)} ${d.getFullYear()} - ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`
    fs.writeFile(`./errors/Error_${time}.txt`, `Time: ${time}\n\n${error}`, err => {
        if (err)
            console.error(err)
    })
})

client.on('ready', () => {
    //client.user.setUsername('Streampybot')
    console.log(`Bot logged in as:\t${client.user.tag}`)
    client.user.setActivity(
        config.settings.activity
            .replace(/{{ *prefix *}}/g, config.settings.prefix)
            .replace(/{{ *site *}}/g, config.settings.site)
            .replace(/{{ *name *}}/g, client.user.username),
        { type: 'PLAYING' }
    ).then(presence => console.log(`Activity set to:\t${presence.game ? presence.game.name : 'none'}`))
})

client.on('message', async message => {
    if (message.channel.type === 'dm') return

    if (message.channel.name.match(/ticket_[0-9]+/)) {
        var date = new Date()
	// TODO: verander dit naar engels
        var days = [ 'zo', 'ma', 'di', 'woe', 'do', 'vr', 'za' ]
        var months = [ 'jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sept', 'okt', 'nov', 'dec' ]
        var time = `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
        var toAppend = `${message.author.tag}${message.author.bot ? '[BOT]' : ''} - ${time}`

        if (message.content && message.content != '') {
            var end = message.content

            if (message.mentions.users) {
                message.mentions.users.forEach(u => {
                    end = end.replace(
                        new RegExp(`<@${u.id}>`, 'g'),
                        `@${u.tag}`
                    )
                })
            }

            if (message.mentions.channels) {
                message.mentions.channels.forEach(c => {
                    end = end.replace(
                        new RegExp(`<#${c.id}>`, 'g'),
                        `#${c.name}`
                    )
                })
            }

            if (message.mentions.roles) {
                message.mentions.roles.forEach(r => {
                    end = end.replace(
                        new RegExp(`<@&${r.id}>`, 'g'),
                        `@${r.name}`
                    )
                })
            }

            toAppend += `\n${end}`
        }
        if (message.embeds.length > 0) {
            toAppend += `\n[EMBED]\n${message.embeds[0].description}`
        }
        if (message.attachments && message.attachments.first()) {
            toAppend += `\n[FILE]\n${message.attachments.first().filename}, ${formatBytes(message.attachments.first().filesize)}`
        }

        toAppend += '\n\n'

        await fs.appendFile(`./tickets/${message.channel.name}.txt`, toAppend, err => {
            if (err) {
                client.emit('error', err)
            }
        })
    }

    if (message.author.bot) return
    if (!message.content.startsWith(config.settings.prefix)) return

    const args = message.content.split(/ +/g)
    const command = args.shift()
        .split(/ +/g)[0]
        .trim()
        .toLowerCase()
        .replace(config.settings.prefix, '')
    const program = client.commands.get(command)
    const adminRole = message.guild.roles.find(r => r.name.toLowerCase().match(/admin/))
    const logChannel = message.guild.channels.find(c => c.name.toLowerCase().match(/log/))

    if (command && program)
        program.run(client, message, args, adminRole, logChannel, con)
})

client.login(secret.discord.token)
