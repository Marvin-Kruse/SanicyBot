const YTP = require("./lib/YoutubePoster");

function YoutubePoster(client, options) {
    return new YTP(client, options);
}
YTP.YoutubePoster = YoutubePoster;

module.exports = YoutubePoster;