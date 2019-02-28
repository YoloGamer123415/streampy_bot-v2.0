const mysql = require('mysql')
const discord = require('discord.js')
const client = new discord.Client()
const fs = require('fs')
var config = require('./config.json')
const token = require('./token.json')
client.commands = new discord.Collection()

var con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    database: 'Streampy'
})

con.connect(err => {
    if (err)
        throw err
})

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
    fs.writeFile(`./errors/Error_${time}`, `Time: ${time}\n\n${error}`, err => {
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
    if (message.author.bot) return
    if (message.channel.type === 'dm') return
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

client.login(token)
