const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Octokit } = require('octokit');
const moment = require('moment');

const octokit = new Octokit();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('github-watch')
        .setDescription('Suivre l\'activité d\'un utilisateur GitHub')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Nom d\'utilisateur GitHub à suivre')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();
        const username = interaction.options.getString('username');

        try {
            // Récupérer les informations de l'utilisateur
            const { data: user } = await octokit.rest.users.getByUsername({
                username: username
            });

            // Récupérer les dernières activités
            const { data: events } = await octokit.rest.activity.listPublicEventsForUser({
                username: username,
                per_page: 5
            });

            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`Activité GitHub de ${user.login}`)
                .setURL(user.html_url)
                .setThumbnail(user.avatar_url)
                .setDescription(`Profil: ${user.name || user.login}\nBio: ${user.bio || 'Aucune bio'}`)
                .addFields(
                    { name: 'Repositories publics', value: `${user.public_repos}`, inline: true },
                    { name: 'Followers', value: `${user.followers}`, inline: true },
                    { name: 'Following', value: `${user.following}`, inline: true },
                    { name: '\u200B', value: '**Dernières activités:**' }
                );

            // Ajouter les 5 dernières activités avec plus de détails
            events.slice(0, 5).forEach(event => {
                let activityDescription = '';
                const date = moment(event.created_at).format('DD/MM/YYYY HH:mm');

                switch (event.type) {
                    case 'PushEvent':
                        const commits = event.payload.commits || [];
                        activityDescription = `🔨 **Push** vers [${event.repo.name}](https://github.com/${event.repo.name})\n`;
                        activityDescription += commits.map(commit =>
                            `↳ \`${commit.sha.substring(0, 7)}\` ${commit.message.split('\n')[0]}`
                        ).join('\n');
                        break;
                    case 'CreateEvent':
                        activityDescription = `📁 **Création** de [${event.repo.name}](https://github.com/${event.repo.name})\nType: ${event.payload.ref_type}`;
                        break;
                    case 'IssuesEvent':
                        activityDescription = `🔍 **Issue ${event.payload.action}** dans [${event.repo.name}](https://github.com/${event.repo.name})\n${event.payload.issue.title}`;
                        break;
                    case 'PullRequestEvent':
                        activityDescription = `📥 **Pull Request ${event.payload.action}** dans [${event.repo.name}](https://github.com/${event.repo.name})\n${event.payload.pull_request.title}`;
                        break;
                    case 'WatchEvent':
                        activityDescription = `⭐ **Star** sur [${event.repo.name}](https://github.com/${event.repo.name})`;
                        break;
                    case 'ForkEvent':
                        activityDescription = `🔱 **Fork** de [${event.repo.name}](https://github.com/${event.repo.name})`;
                        break;
                    default:
                        activityDescription = `Activité dans [${event.repo.name}](https://github.com/${event.repo.name})`;
                }
                embed.addFields({
                    name: `${date}`,
                    value: activityDescription
                });
            });

            // Ajouter le lien vers la grille de contributions
            embed.setImage(`https://ghchart.rshah.org/${username}`);

            embed.setTimestamp()
                .setFooter({ text: 'Dernière mise à jour' });

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply('Une erreur est survenue lors de la récupération des informations GitHub. Vérifiez que le nom d\'utilisateur est correct.');
        }
    },
};