const { SlashCommandBuilder, EmbedBuilder, version } = require('discord.js');
const { version: botVersion } = require('../package.json');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('📃 ⟩ Affiche les informations du bot'),

    async execute(interaction) {
        const client = interaction.client;

        // Récupérer la liste des commandes
        const commands = Array.from(client.commands.values());
        const commandList = commands
            .map(cmd => `\`/${cmd.data.name}\` - ${cmd.data.description} \n`)
            .join('\n');


        // Créer l'embed
        const infoEmbed = new EmbedBuilder()
            .setColor(`#${process.env.COLOR_INFO}`)
            .setTitle(`Informations sur ${client.user.username}`)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                {
                    name: '👨‍💻 Développeur',
                    value: process.env.FOOTER_MSG.replace('Développé par ', ''),
                    inline: true
                },
                {
                    name: '📊 Versions',
                    value: `Bot: v${botVersion}\nDiscord.js: v${version} \n`,
                    inline: true
                },
                {
                    name: '📈 Statistiques',
                    value: `Serveurs: ${client.guilds.cache.size}\nLatence: ${client.ws.ping}ms \n`,
                    inline: true
                },
                {
                    name: '🤖 Commandes disponibles \n',
                    value: commandList,
                    inline: false
                },
                {
                    name: '',
                    value: '\n',
                    inline: true,
                },
            )
            .setFooter({
                text: process.env.FOOTER_MSG,
                iconURL: client.user.displayAvatarURL()
            })
            .setTimestamp();


        await interaction.reply({ embeds: [infoEmbed] });
    },
};