const discord = require('discord.js')

exports.run = async (client, message, args) => {
    const m = await message.channel.send({
        embed: {
            description: `Calculating ping...`,
            color: 2434341
        }
    })

    m.edit({
        embed: {
            description: `Bot ping: **__${m.createdTimestamp - message.createdTimestamp}__ms**.\nAPI ping: *__${parseInt(client.ping)}__ms*.`,
            color: ((m.createdTimestamp - message.createdTimestamp) > 500 || client.ping > 500) ? 13632027 : 8311585,
        }
    })

}

exports.help = {
    name: 'Ping',
    description: 'Get the ping of the bot.',
    command: 'ping',
    usage: '{{ prefix }}ping',
    params: null,
    isAdmin: false
}
