
module.exports.delay = delay;
module.exports.size = size;
module.exports.isValidURL = isValidURL;
module.exports.replaceContents = replaceContents;


function size(obj) {
    if(Array.isArray(obj)) {
        return obj.length;
    } else {
        var size = 0,
            key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    }
};

function isValidURL(url){
    return url.match(/^https?:\/\/(www\.)?youtube\.com\/(channel\/UC[\w-]{21}[AQgw]|(c\/|user\/)?[\w-]+)$/) != null
}


function delay(delayInms) {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  } catch (_) { }
}

function replaceContents(txt, video, channelInfos, ChannelDATA) {
    return String(txt).replace(/{videourl}/ig, video.link)
        .replace(/{video}/ig, video.link)
        .replace(/{url}/ig, video.link)
        .replace(/{link}/ig, video.link)
        .replace(/{vid}/ig, video.link)
        .replace(/{uri}/ig, video.link)

        .replace(/{videotitle}/ig, video.title)
        .replace(/{name}/ig, video.title)
        .replace(/{title}/ig, video.title)

        .replace(/{videoauthorname}/ig, channelInfos.name)
        .replace(/{authorname}/ig, channelInfos.name)
        .replace(/{author}/ig, channelInfos.name)
        .replace(/{channel}/ig, channelInfos.name)
        .replace(/{channelname}/ig, channelInfos.name)
        .replace(/{creator}/ig, channelInfos.name)
        .replace(/{creatorname}/ig, channelInfos.name)

        .replace(/{discorduser}/ig, ChannelDATA.DiscordUser)
        .replace(/{user}/ig, ChannelDATA.DiscordUser)
        .replace(/{member}/ig, ChannelDATA.DiscordUser)

        .replace(`{SPACE}`, `\n\n`)
        .replace(`{SPACE}`, `\n\n`)
        .replace(`{SPACE}`, `\n\n`)
}