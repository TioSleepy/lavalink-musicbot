const util = require("../util");

module.exports = {
    name: "shuffle",
    aliases: ["sf"],
    exec: async (msg) => {
        const { music } = msg.guild;
        if (!music.player || !music.player.playing) return msg.channel.send(util.embed().setDescription("❌ | Atualmente não estou tocando nada"));
        if (!music.queue.length) return msg.channel.send(util.embed().setDescription("❌ | Queue vazia."));
        if (!msg.member.voice.channel)
            return msg.channel.send(util.embed().setDescription("❌ | Você deve estar em um canal de voz."));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(util.embed().setDescription(`❌ | Você deve estar no canal ${msg.guild.me.voice.channel} para usar esse comando.`));

        music.queue = util.shuffleArray(music.queue);

        msg.channel.send(util.embed().setDescription(`✅ | Queue Misturada! Digite \`${msg.client.prefix}queue\` para ver mudanças.`));
    }
};
