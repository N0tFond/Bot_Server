// Command handler for Discord bot
const Discord = require('discord.js');
const { MessageFlags } = require('discord.js');
const { REST, Routes } = Discord;
const path = require('path');
const fs = require('fs');

const commandsHandler = async (client) => {
    const commmands = [];

    const comandsPath = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(comandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(comandsPath, file);
        const command = require(filePath);
        client.commands.set(command.data.name, command);
        commmands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        console.log("⟩ Enregisrement des commandes...");

        await rest.put(Routes.applicationCommands(process.env.APP_ID), {
            body: commmands
        });

        console.log("⟩ Commandes enregistrées avec succès !");
    } catch (error) {
        console.error(error);
    }
};

module.exports = commandsHandler;