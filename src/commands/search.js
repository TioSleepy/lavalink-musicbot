const util = require("../util");

module.exports = {
    name: "search",
    exec: async (msg, args) => {
        const { music } = msg.guild;
        if (!msg.member.voice.channel)
            return msg.channel.send(util.embed().setDescription("❌ | Você deve estar em um canal de voz."));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(util.embed().setDescription(`❌ | Você deve estar no canal ${msg.guild.me.voice.channel} para usar esse comando.`));

        const missingPerms = util.missingPerms(msg.guild.me.permissionsIn(msg.member.voice.channel), ["CONNECT", "SPEAK"]);
        if ((!music.player || !music.player.playing) && missingPerms.length)
            return msg.channel.send(util.embed().setDescription(`❌ | Eu preciso de ${missingPerms.length > 1 ? "essas" : "essa"} permis${missingPerms.length > 1 ? "são" : "sões"} nesse canal de voz: ${missingPerms.map(x => `\`${x}\``).join(", ")}.`));

        if (!music.node || !music.node.connected)
            return msg.channel.send(util.embed().setDescription("❌ | Servidor principal desligado, favor contatar o criador do bot Tio#7717."));

        const query = args.join(" ");
        if (!query) return msg.channel.send(util.embed().setDescription("❌ | Faltam Argumentos."));

        try {
            let { tracks } = await music.load(`ytsearch:${query}`);
            if (!tracks.length) return msg.channel.send(util.embed().setDescription("❌ | Não encontrei nada."));

            tracks = tracks.slice(0, 10);

            const resultMessage = await msg.channel.send(util.embed()
                .setAuthor("Search Result", msg.client.user.displayAvatarURL())
                .setDescription(tracks.map((x, i) => `\`${++i}.\` **${x.info.title}**`))
                .setFooter("Select from 1 to 10 or type \"cancel\" to cancel the command."));

            const collector = await awaitMessages();
            if (!collector) return resultMessage.edit(util.embed().setDescription("❌ | Tempo expirado!"));
            const response = collector.first();

            if (response.deletable) response.delete();

            if (/^cancel$/i.exec(response.content))
                return resultMessage.edit(util.embed().setDescription("✅ | Cancelado!"));

            const track = tracks[response.content - 1];
            track.requester = msg.author;
            music.queue.push(track);

            if (music.player && music.player.playing) {
                resultMessage.edit(util.embed().setDescription(`✅ | **${track.info.title}** Adicionada a lista.`));
            } else {
                resultMessage.delete();
            }

            if (!music.player) await music.join(msg.member.voice.channel);
            if (!music.player.playing) await music.start();

            music.setTextCh(msg.channel);
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`);
        }

        async function awaitMessages() {
            try {
                const collector = await msg.channel.awaitMessages(
                    m => m.author.equals(msg.author) && (/^cancel$/i.exec(m.content) || (!isNaN(parseInt(m.content, 10)) && (m.content >= 1 && m.content <= 10))),
                    {
                        time: 10000,
                        max: 1,
                        errors: ["time"]
                    }
                );
                return collector;
            } catch {
                return null;
            }
        }
    }
};
