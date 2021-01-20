const util = require("../util");

module.exports = {
    name: "remove",
    aliases: ["rm"],
    exec: async (msg, args) => {
        const { music } = msg.guild;
        if (!music.player || !music.player.playing) return msg.channel.send(util.embed().setDescription("❌|  Atualmente não estou tocando nada."));
        if (!music.queue.length) return msg.channel.send(util.embed().setDescription("❌ | lista vazia."));

        if (!msg.member.voice.channel)
            return msg.channel.send(util.embed().setDescription("❌ | Você deve estar em um canal de voz."));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(util.embed().setDescription(`❌ | Você deve estar no canal ${msg.guild.me.voice.channel} para usar esse comando.`));

        if (!args[0]) return msg.channel.send(util.embed().setDescription("❌ | Faltando argumentos."));

        let iToRemove = parseInt(args[0], 10);
        if (isNaN(iToRemove) || iToRemove < 1 || iToRemove > music.queue.length)
            return msg.channel.send(util.embed().setDescription("❌ | Numero invalido para remover."));

        const removed = music.queue.splice(--iToRemove, 1)[0];
        msg.channel.send(util.embed().setDescription(`✅ | Removi a musica **${removed.info.title}** da lista.`));
    }
};
