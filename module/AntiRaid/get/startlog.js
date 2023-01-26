module.exports = (client) => {
    client.systemstartunequal.ensure('systemstartunequal', {
        firststart: true
    })
    if (client.systemstartunequal.get('systemstartunequal', 'firststart')) {
        console.log(`
        Hello developer's, This is only shown when you start the npm module for the first time.
        This module was developed by Scorfy on behalf of Unequal - Community. The module was sponsored by Nexo.Systems.
        
        We wish you a pleasant day.

        Socials:

        Discord:
        https://discord.gg/jexdGcBauP/

        Website:
        https://unequal-bot.eu/
        
        Big greetings 
        Unequal -team 
        `.cyan)
        client.systemstartunequal.set('systemstartunequal', false, 'firststart')
    }
}