const util = require("../util");

const durationPattern = /^[0-5]?[0-9](:[0-5][0-9]){1,2}$/;

module.exports = {
    name: "seek",
    exec: async (msg, args) => {
        const { music } = msg.guild;
        if (!music.player || !music.player.playing) return msg.channel.send(util.embed().setDescription("❌ | Atualmente não estou tocando nada."));
        if (!msg.member.voice.channel)
            return msg.channel.send(util.embed().setDescription("❌ | Você deve estar em um canal de voz."));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(util.embed().setDescription(`❌ | Você deve estar no canal ${msg.guild.me.voice.channel} para usar esse comando.`));

        if (!music.current.info.isSeekable)
            return msg.channel.send(util.embed().setDescription("❌ | A musica atual não pode ser avançada."));

        const duration = args[0];
        if (!duration)
            return msg.channel.send(util.embed().setDescription("❌ | Você deve prover um tempo valido. Exemplo `1:34`."));
        if (!durationPattern.test(duration))
            return msg.channel.send(util.embed().setDescription("❌ | Você deve prover um tempo valido. Exemplo `1:34`."));

        const durationMs = util.durationToMillis(duration);
        if (durationMs > music.current.info.length)
            return msg.channel.send(util.embed().setDescription("❌ | A musica atual é menor que o tempo informado. "));

        try {
            await music.player.seek(durationMs);
            msg.channel.send(util.embed().setDescription(`✅ | Musica avançada para ${util.millisToDuration(durationMs)}.`));
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`);
        }
    }
};
