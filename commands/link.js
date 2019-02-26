const discord = require('discord.js')
const config = require('../config.json')

exports.run = (client, message, args) => {
    message.delete()
    message.channel.send({
        embed: {
            title: 'Links',
            description: `» [Our site](https://${config.site})\n» [Our panel](https://panel.${config.site})\n» [Our Discord](https://discord.gg/cTh9SZ2)\n» [Our YouTube](https://youtube.com/streampy)\n» [Our Twitter](https://twitter.com/StreampyH)\n» For questions: info@${config.site}`,
            url: `https://${config.site}`,
            color: 1409939,
            footer: {
                "text": `© Copyright Streampyhosting - ${new Date().getFullYear()}`
            }
        }
    })
}

exports.help = {
    name: 'Links',
    description: 'Get a list of useful links.',
    command: 'link',
    usage: '{{ prefix }}help',
    params: null,
    isAdmin: false
}
