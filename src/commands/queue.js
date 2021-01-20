const util = require("../util");

module.exports = {
    name: "queue",
    aliases: ["q"],
    exec: async (msg) => {
        const { music } = msg.guild;
        if (!music.player || !music.player.playing) return msg.channel.send(util.embed().setDescription("❌ | Atualmente não estou tocando nada."));
        if (!music.queue.length) return msg.channel.send(util.embed().setDescription("❌ | A lista esta vazia."));

        const queue = music.queue.map((t, i) => `\`${++i}.\` **${t.info.title}** ${t.requester}`);
        const chunked = util.chunk(queue, 10).map(x => x.join("\n"));

        const embed = util.embed()
            .setAuthor(`${msg.guild.name} Lista de Musica`, msg.guild.iconURL({ dynamic: true }))
            .setDescription(chunked[0])
            .setFooter(`Pagina 1 de ${chunked.length}.`);

        try {
            const queueMsg = await msg.channel.send(embed);
            if (chunked.length > 1) await util.pagination(queueMsg, msg.author, chunked);
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`);
        }
    }
};
