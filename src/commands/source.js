const util = require("../util");

module.exports = {
    name: "source",
    aliases: ["src"],
    exec: (msg) => {
        msg.channel.send(util.embed().setDescription("✅ | [Aqui](https://github.com/Allvaa/lavalink-musicbot) esta o open source usado para fazer esse bot."));
    }
};
