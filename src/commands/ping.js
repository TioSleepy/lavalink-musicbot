module.exports = {
    name: "pingmusica",
    exec: (msg) => {
        msg.channel.send(`🏓 Pong! \`${msg.client.ws.ping}ms\``);
    }
};
