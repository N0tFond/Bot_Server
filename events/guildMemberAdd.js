
// Événement guildMemberAdd qui se déclenche lorsqu'un nouveau membre rejoint le serveur
module.exports = {
    name: 'guildMemberAdd',
    once: false,
    execute(member) {
        try {
            // Obtenir le canal pour envoyer le message de bienvenue en utilisant son ID
            const channelId = '1367978148263628890';
            const channel = member.guild.channels.cache.get(channelId);

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

            // Créer et envoyer le message de bienvenue
            channel.send(`Bienvenue sur le serveur, <@${member.id}> ! Nous sommes ravis de t'accueillir parmi nous.`);

            console.log(`Nouveau membre accueilli: ${member.user.tag}`);
        } catch (error) {
            console.error(`Erreur lors de l'accueil d'un nouveau membre:`, error);
        }
    },
};
