const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("ping").setDescription("🔎 】Permet de tester le bot et obtenir sa latence."),

    async execute(interaction) {
        const sentMessage = await interaction.reply({ content: "🏓 Je vérifie la latence pour vous !", fetchReply: true });
        const latency = sentMessage.createdTimestamp - interaction.createdTimestamp;

        await interaction.editReply(`🏓 Latence ⟩ \`${latency}\`ms.`);
    },
};
