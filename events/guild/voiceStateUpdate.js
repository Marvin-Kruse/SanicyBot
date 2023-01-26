module.exports = async (client, oldState, newState) => {
    let player = client.manager.players.get(oldState.guild.id);
    if (!player) return;
    if (oldState.channelId && !newState.channelId) {
        if (newState.id === client.user.id) {
            player.destroy()
        }
    }
    if (!oldState.serverMute && newState.serverMute) {
        if (newState.member.user === client.user) {
            if (oldState.guild.channels.cache.get(player.voiceChannel)) {
                let timeout_delay = 5 * 1000;
                setTimeout(async () => {
                    let member = oldState.guild.members.me;
                    if (!member.voice.channel) return;
                    if (!player.playing) return;
                    if (member.voice.serverMute) {
                        player.destroy()
                    }
                }, timeout_delay);
            }
        }
    };
}