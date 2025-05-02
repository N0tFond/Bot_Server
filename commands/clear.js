const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('💬 】Permet aux membres de l\'équipe de nétoyer un salon.')
        .addIntegerOption(option =>
            option.setName('nombre')
                .setDescription('Le nombre de messages à supprimer.')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(99)
        ),

    async execute(interaction) {

        const nbMessages = interaction.options.getInteger('nombre');
        const staffRole = process.env.STAFF_ROLE;

        if (!interaction.member.roles.cache.has(staffRole)) {
            return interaction.reply({ content: `${process.env.CROSS} ⟩ Vous n'avez pas la permission d'utiliser cette commande.`, flags: MessageFlags.Ephemeral });
        }

        try {
            await interaction.channel.bulkDelete(nbMessages, true);
            await interaction.reply({ content: `${process.env.CHECK} ⟩ ${nbMessages} messages supprimés avec succès !`, flags: MessageFlags.Ephemeral });
        } catch (error) {
            console.error('⚠️ ⟩ Erreur lors de la suppression des messages:', error);
            await interaction.reply({ content: `${process.env.CROSS} ⟩ Une erreur est survenue lors de la suppression des messages.`, flags: MessageFlags.Ephemeral });
        }
    }
}