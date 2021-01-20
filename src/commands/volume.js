const util = require("../util");

module.exports = {
    name: "volume",
    aliases: ["vol"],
    exec: async (msg, args) => {
        const { music } = msg.guild;
        const newVolume = parseInt(args[0], 10);
        if (!music.player || !music.player.playing) return msg.channel.send(util.embed().setDescription("❌ | Atualmente não estou tocando nada."));
        try {
            if (isNaN(newVolume)) {
                msg.channel.send(util.embed().setDescription(`🔉 | Current volume \`${music.volume}\`.`));
            } else {
                if (!msg.member.voice.channel)
                    return msg.channel.send(util.embed().setDescription("❌ | Você deve estar em um canal de voz!."));
                if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
                    return msg.channel.send(util.embed().setDescription(`❌ | Você deve estar em ${msg.guild.me.voice.channel} para usar esse comando`));

                if (newVolume < 0 || newVolume > 150)
                    return msg.channel.send(util.embed().setDescription("❌ | Você so pode colocar o volume de 0 a 150%"));

                await music.setVolume(newVolume);
                msg.channel.send(util.embed().setDescription(`🔉 | Volume colocado em \`${music.volume}\`.`));
            }
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`);
        }
    }
};
