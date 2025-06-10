const { PresenceUpdateStatus, ActivityType } = require('discord.js');

const ReadyHandler = (client) => {
    client.once('ready', () => {
        client.user.setPresence({
            activities: [{
                name: 'Developing new services',
                type: ActivityType.Playing
            }],
            status: PresenceUpdateStatus.DoNotDisturb
        });

        console.log(`⟩ Connecté en tant que ${client.user.username}`);
    });
};

module.exports = ReadyHandler;