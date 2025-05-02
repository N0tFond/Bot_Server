const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('🚓 】Permet aux staff de bannir un utilisateur.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Utilisateur à bannir')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Raison du bannissement')
                .setRequired(false)),

    async execute(interaction) {

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'Aucune raison fournie';
        const member = await interaction.guild.members.fetch(user.id);
        const staffRole = process.env.STAFF_ROLE;

        if (!interaction.member.roles.cache.has(staffRole)) {
            return interaction.reply({
                content: `${process.env.CROSS} ⟩ Vous devez être staff pour utiliser cette commande.`,
                flags: MessageFlags.Ephemeral
            });
        }

        if (member.roles.cache.has(staffRole)) {
            return interaction.reply({
                content: `${process.env.CROSS} ⟩ Vous ne pouvez pas bannir un membre du staff.`,
                flags: MessageFlags.Ephemeral
            });
        }

        if (!member) {
            return interaction.reply({ content: `${process.env.CROSS} ⟩ Utilisateur introuvable dans le serveur.`, flags: MessageFlags.Ephemeral });
        }

        try {
            await user.send(`⟩ Vous avez été banni du serveur **${interaction.guild.name}** pour la raison suivante : \`${reason}\``);
        } catch (error) {
            if (error.code === 50007) {
                return;
            } else {
                console.error('⚠️ ⟩ Erreur lors de l\'envoi du message privé:', error);
            }
        }

        try {
            await member.ban({ reason: reason });
            await interaction.reply({ content: `${process.env.CHECK} ⟩ ${user.tag} a été banni avec succès pour la raison : *${reason}* !` });
            console.log(`🚓 ⟩ ${user.tag} a été banni du serveur ${interaction.guild.name} par ${interaction.user.username} \n→ raison : ${reason}`);
        } catch (error) {
            console.error('⚠️ ⟩ Erreur lors du bannissement de l\'utilisateur:', error);
            await interaction.reply({ content: `${process.env.CROSS} ⟩ Une erreur est survenue lors du bannissement de l'utilisateur.`, flags: MessageFlags.Ephemeral });
        }
    }
}