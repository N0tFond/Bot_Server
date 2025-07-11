require('dotenv').config();
const { SlashCommandBuilder, MessageFlags, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('staff')
        .setDescription('👑 Liste tous les membres du staff du serveur'),

    async execute(interaction) {
        await interaction.deferReply();

        try {
            const staffRole = interaction.guild.roles.cache.get(process.env.STAFF_ROLE);

            // Vérifier si le rôle staff existe
            if (!staffRole) {
                return await interaction.editReply({
                    content: 'Erreur: Le rôle staff configuré est introuvable.',
                    flags: MessageFlags.Ephemeral
                });
            }

            const ignoredRoleIds = ["1367978086951424022", "1367978085881745448", "1380165775171780619"];

            const members = await interaction.guild.members.fetch();
            const membersWithStaffRole = members.filter(member => member.roles.cache.has(staffRole.id))
                .sort((a, b) => {
                    // Obtenir tous les rôles non ignorés pour les deux membres
                    const aRoles = Array.from(a.roles.cache.values())
                        .filter(role => role.id !== interaction.guild.roles.everyone.id && !ignoredRoleIds.includes(role.id))
                        .sort((r1, r2) => r2.position - r1.position);
                    const bRoles = Array.from(b.roles.cache.values())
                        .filter(role => role.id !== interaction.guild.roles.everyone.id && !ignoredRoleIds.includes(role.id))
                        .sort((r1, r2) => r2.position - r1.position);

                    // Comparer les positions des rôles un par un
                    for (let i = 0; i < Math.max(aRoles.length, bRoles.length); i++) {
                        const aRole = aRoles[i];
                        const bRole = bRoles[i];

                        // Si un membre n'a plus de rôles à comparer, il est considéré comme inférieur
                        if (!aRole) return 1;
                        if (!bRole) return -1;

                        if (aRole.position !== bRole.position) {
                            return bRole.position - aRole.position;
                        }
                    }

                    // Si tous les rôles sont égaux, trier par nom d'utilisateur
                    return a.user.username.localeCompare(b.user.username);
                });

            // Vérifier s'il y a des membres staff
            if (membersWithStaffRole.size === 0) {
                return await interaction.editReply({
                    content: 'Aucun membre du staff trouvé sur ce serveur.',
                });
            }

            const staffEmbed = new EmbedBuilder()
                .setColor(parseInt(process.env.COLOR_SUCCESS, 16) || 0x00FF00) // Conversion hexadécimal correcte
                .setTitle('👑 Liste des Membres du Staff')
                .setDescription(membersWithStaffRole.map(member => {
                    const sortedRoles = Array.from(member.roles.cache.values())
                        .sort((a, b) => b.position - a.position)
                        .filter(role => role.id !== interaction.guild.roles.everyone.id && !ignoredRoleIds.includes(role.id));

                    const displayRole = sortedRoles[0] || { name: "Aucun rôle" };

                    // Récupérer l'activité du membre
                    let activity = "";
                    if (member.presence && member.presence.activities && member.presence.activities.length > 0) {
                        const currentActivity = member.presence.activities[0];
                        if (currentActivity.type === 4) { // Custom status
                            activity = currentActivity.state ? ` \n> ${currentActivity.state}` : "";
                        } else {
                            const activityTypes = {
                                0: "Joue à",
                                1: "Streame",
                                2: "Écoute",
                                3: "Regarde",
                                5: "Participe à"
                            };
                            activity = `\n> ${activityTypes[currentActivity.type] || "Fait"} ${currentActivity.name}`;
                        }
                    }

                    return `• **${member.user.displayName || member.user.username}** - ${displayRole.name}${activity}`;
                }).join('\n\n'))
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setTimestamp()
                .setFooter({
                    text: interaction.guild.name,
                    iconURL: interaction.guild.iconURL({ dynamic: true })
                });

            // Vérifier si la description ne dépasse pas la limite de Discord (4096 caractères)
            if (staffEmbed.data.description.length > 4096) {
                const truncatedDescription = staffEmbed.data.description.substring(0, 4000) + '\n\n... (liste tronquée)';
                staffEmbed.setDescription(truncatedDescription);
            }

            await interaction.editReply({
                embeds: [staffEmbed]
            });

        } catch (error) {
            console.error('Erreur avec la commande staff:', error);
            await interaction.editReply({
                content: 'Une erreur est survenue lors de la récupération des membres du staff.',
                flags: MessageFlags.Ephemeral
            });
        }
    },
};