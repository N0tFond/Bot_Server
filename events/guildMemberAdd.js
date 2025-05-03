const { EmbedBuilder } = require("discord.js");

// Événement guildMemberAdd qui se déclenche lorsqu'un nouveau membre rejoint le serveur
module.exports = {
    name: 'guildMemberAdd',
    once: false,
    execute(member) {
        try {

            // Obtenir le canal pour envoyer le message de bienvenue en utilisant son ID
            const channelId = '1367978148263628890';
            const channel = member.guild.channels.cache.get(channelId);

            const welcomeMessages = [
                `Hey ${member.user.username}! Bienvenue dans notre repaire secret 🕵️‍♂️`,
                `🎉 Regardez qui vient d'arriver! C'est ${member.user.username}!`,
                `Un sauvage ${member.user.username} apparaît! 🌟`,
                `Hourra! ${member.user.username} nous rejoint dans l'aventure! 🚀`,
                `On t'attendait ${member.user.username}! La fête peut commencer 🎈`,
                `${member.user.username} vient de tomber du ciel! 🪂`,
                `Bienvenue ${member.user.username}! Le café est chaud et les memes sont frais! ☕`,
                `${member.user.username} entre dans le chat comme un boss! 😎`,
                `Attention! ${member.user.username} débarque sur le serveur! 💥`,
                `${member.user.username} a rejoint la partie! Que le jeu commence! 🎮`,
                `Oh là là! ${member.user.username} nous fait l'honneur de sa présence! 👑`,
                `Le légendaire ${member.user.username} vient d'apparaître! 📸`,
                `${member.user.username} a trouvé notre cachette secrète! Bien joué! 🔍`,
                `Tout le monde se calme, ${member.user.username} est parmi nous! 🤩`,
                `${member.user.username} déroule le tapis rouge! 🚶‍♂️🚶‍♀️`,
                `Les dieux ont parlé, ${member.user.username} est arrivé! ⚡`,
                `${member.user.username} a franchi la porte! Préparez les confettis! 🎊`,
                `Un nouveau challenger approche: ${member.user.username}! 🥊`,
                `${member.user.username} a rejoint la conversation! Cachez les cookies! 🍪`,
                `Notre communauté s'agrandit avec ${member.user.username}! 🌱`
            ];

            const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

            channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle('Bienvenue !')
                        .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL() })
                        .setDescription(randomMessage)
                        .setThumbnail(member.user.displayAvatarURL())
                ],
            });

            // Vérifier si le canal a été trouvé
            if (!channel) {
                console.error(`Le canal avec l'ID ${channelId} n'a pas été trouvé pour envoyer le message de bienvenue.`);
                return;
            }

            // Attribuer un rôle au nouveau membre en utilisant l'ID du rôle
            const roleId = '1367978118685659267';
            const role = member.guild.roles.cache.get(roleId);

            // Vérifier si le rôle a été trouvé
            if (!role) {
                console.error(`Le rôle avec l'ID ${roleId} n'a pas été trouvé.`);
            } else {
                // Ajouter le rôle au membre
                member.roles.add(role)
                    .then(() => console.log(`Rôle ${role.name} attribué à ${member.user.tag}`))
                    .catch(error => console.error(`Impossible d'attribuer le rôle à ${member.user.tag}:`, error));
            }

            console.log(`Nouveau membre accueilli: ${member.user.tag}`);
        } catch (error) {
            console.error(`Erreur lors de l'accueil d'un nouveau membre:`, error);
        }
    },
};
