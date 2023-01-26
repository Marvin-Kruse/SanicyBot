const { ShardingManager, Shard } = require('discord.js');

const manager = new ShardingManager('./bot/index.js', { token: require('./config/discordbot/discordconfig.json').token });

manager.on('shardCreate', async shard => {
	let cool = shard
});
manager.spawn();