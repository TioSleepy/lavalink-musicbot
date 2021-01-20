const util = require("../util");

module.exports = {
    name: "stop",
    aliases: ["leave", "dc"],
    exec: async (msg) => {
        const { music } = msg.guild;
        if (!music.player) return msg.channel.send(util.embed().setDescription("❌ | Atualmente não estou tocando nada."));
        if (!msg.member.voice.channel)
            return msg.channel.send(util.embed().setDescription("❌ | Você deve estar em um canal de voz."));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(util.embed().setDescription(`❌ | Você deve estar no canal ${msg.guild.me.voice.channel} para usar esse comando.`));

        try {
            await music.stop();
            msg.react("⏹️").catch(e => e);
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`);
        }
    }
};
