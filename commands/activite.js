const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('activité')
        .setDescription('Affiche l\'activité d\'un utilisateur')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('L\'utilisateur dont vous voulez voir l\'activité')
                .setRequired(false)),

    async execute(interaction) {
        try {
            // Récupère l'utilisateur mentionné ou l'utilisateur qui a exécuté la commande
            const user = interaction.options.getUser('utilisateur') || interaction.user;
            console.log(`Recherche d'activité pour l'utilisateur: ${user.username} (${user.id})`);

            const member = await interaction.guild.members.fetch(user.id).catch(error => {
                console.error(`Erreur lors de la récupération du membre: ${error}`);
                return null;
            });

            if (!member) {
                console.log(`Membre non trouvé pour l'utilisateur: ${user.username}`);
                return interaction.reply({
                    content: `Je n'ai pas pu trouver ${user.username} sur ce serveur.`,
                    ephemeral: true
                });
            }

            // Récupère l'activité de l'utilisateur correctement
            const activities = member.presence?.activities;

            if (!activities || activities.length === 0) {
                console.log(`Pas d'activités pour ${user.username}`);
                return interaction.reply({
                    content: `${user.username} n'a aucune activité en cours.`,
                    ephemeral: false
                });
            }

            // Ajoute la couleur verte pour l'embed
            const embedColor = process.env.COLOR_GREEN

            // Crée un embed pour afficher les activités
            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setTitle(`Activité de ${user.username}`)
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
            // Parcourt toutes les activités
            activities.forEach((activity, index) => {

                // Ajoute les détails de l'activité à l'embed
                let activityDetails = '';

                // Si c'est Spotify
                if (activity.name === 'Spotify') {
                    console.log(`Activité Spotify détectée`);
                    const artist = activity.state; // L'artiste
                    const songName = activity.details; // Le nom de la chanson
                    const albumName = activity.assets?.largeText; // Le nom de l'album


                    activityDetails = `\n> 🎵 • **Écoute Spotify**`;
                    activityDetails += `\n> 📀 • Titre: ${songName || 'Inconnu'}`;
                    activityDetails += `\n> 🎤 • Artiste: ${artist || 'Inconnu'}`;

                    if (albumName) {
                        activityDetails += `\n> 💿 • Album: ${albumName}\n`;
                    }

                    // Ajoute l'image de l'album si disponible
                    if (activity.assets?.largeImage) {
                        try {
                            const spotifyImageId = activity.assets.largeImage.split(':')[1];
                            embed.setImage(`https://i.scdn.co/image/${spotifyImageId}`);
                        } catch (error) {
                            console.error(`Erreur lors de la récupération de l'image: ${error}`);
                        }
                    }
                } else {
                    // Pour les autres types d'activités
                    activityDetails = `**${activity.name}**`;

                    if (activity.details) {
                        activityDetails += `\n> ${activity.details}`;
                    }
                    if (activity.state) {
                        activityDetails += `\n> ${activity.state}\n`;
                    }

                    // Ajoute des informations supplémentaires en fonction du type d'activité
                    if (activity.type === 0) activityDetails = `\n> 🎮• Joue à ${activityDetails}`;
                    if (activity.type === 1) activityDetails = `\n> 📺• Stream ${activityDetails}`;
                    if (activity.type === 2) activityDetails = `\n> 🎧• Écoute ${activityDetails}`;
                    if (activity.type === 3) activityDetails = `\n> 👀• Regarde ${activityDetails}`;
                    if (activity.type === 5) activityDetails = `\n> 🏆• En compétition : ${activityDetails}`;
                }

                embed.addFields({ name: `Activité ${index + 1}`, value: activityDetails });
            });

            console.log(`Réponse envoyée avec ${activities.length} activité(s)`);
            return interaction.reply({
                embeds: [embed],
                ephemeral: false
            });

        } catch (error) {
            console.error(`Erreur générale dans la commande activité: ${error}`);
            return interaction.reply({
                content: `Une erreur est survenue lors de la récupération des activités: ${error.message}`,
                ephemeral: true
            });
        }
    }
}