const ai = require("./get/index");

function AntiRaid(client) {
    const path = __dirname
    return new ai(client, path);
}
ai.AntiRaid = AntiRaid;

module.exports = AntiRaid;