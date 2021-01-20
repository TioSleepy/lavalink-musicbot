const util = require("../util");

module.exports = {
    name: "play",
    aliases: ["p"],
    exec: async (msg, args) => {
        const { music } = msg.guild;
        if (!msg.member.voice.channel)
            return msg.channel.send(util.embed().setDescription("❌ | Você deve estar em um canal de voz."));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(util.embed().setDescription(`❌ | Você deve estar no canal ${msg.guild.me.voice.channel} para usar esse comando.`));

        const missingPerms = util.missingPerms(msg.guild.me.permissionsIn(msg.member.voice.channel), ["CONNECT", "SPEAK"]);
        if ((!music.player || !music.player.playing) && missingPerms.length)
            return msg.channel.send(util.embed().setDescription(`❌ | Eu preciso das  ${missingPerms.length > 1 ? "perms" : "perm"} permission${missingPerms.length > 1 ? "" : ""} no seu canal de voz: ${missingPerms.map(x => `\`${x}\``).join(", ")}.`));

        if (!music.node || !music.node.connected)
            return msg.channel.send(util.embed().setDescription("❌ | Servidor principal desligado, favor contactar o criador do bot Tio#7717."));

        const query = args.join(" ");
        if (!query) return msg.channel.send(util.embed().setDescription("❌ | Faltam Argumentos."));

        try {
            const { loadType, playlistInfo: { name }, tracks } = await music.load(util.isValidURL(query) ? query : `ytsearch:${query}`);
            if (!tracks.length) return msg.channel.send(util.embed().setDescription("❌ | Não achei nada."));
            
            if (loadType === "PLAYLIST_LOADED") {
                for (const track of tracks) {
                    track.requester = msg.author;
                    music.queue.push(track);
                }
                msg.channel.send(util.embed().setDescription(`✅ | Carregadas \`${tracks.length}\` musicas de **${name}**.`));
            } else {
                const track = tracks[0];
                track.requester = msg.author;
                music.queue.push(track);
                if (music.player && music.player.playing)
                    msg.channel.send(util.embed().setDescription(`✅ | **${track.info.title}** adicionada a lista.`));
            }
            
            if (!music.player) await music.join(msg.member.voice.channel);
            if (!music.player.playing) await music.start();

            music.setTextCh(msg.channel);
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`);
        }
    }
};
