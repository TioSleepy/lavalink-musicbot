const util = require("../util");

module.exports = {
    name: "loop",
    aliases: ["repeat"],
    exec: (msg) => {
        const { music } = msg.guild;
        if (!music.player) return msg.channel.send(util.embed().setDescription("❌ | Atualmente não estou tocando nada."));
        if (!msg.member.voice.channel)
            return msg.channel.send(util.embed().setDescription("❌ | Você deve estar em um canal de voz."));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(util.embed().setDescription(`❌ | Você deve estar no canal ${msg.guild.me.voice.channel} para usar esse comando.`));

        music.loop = !music.loop;

        msg.channel.send(util.embed().setDescription(`✅ | Loop ${music.loop ? "Ativado" : "Desativado"}.`));
    }
};
