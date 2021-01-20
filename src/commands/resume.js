const util = require("../util");

module.exports = {
    name: "resume",
    exec: async (msg) => {
        const { music } = msg.guild;
        if (!music.player || !music.player.playing) return msg.channel.send(util.embed().setDescription("❌|  Atualmente não estou tocando nada."));
        if (!msg.member.voice.channel)
            return msg.channel.send(util.embed().setDescription("❌ | Você deve estar em um canl de voz."));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(util.embed().setDescription(`❌ | Você deve estar no canal ${msg.guild.me.voice.channel} para usar esse comando.`));

        try {
            await music.resume();
            msg.react("▶️").catch(e => e);
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`);
        }
    }
};
