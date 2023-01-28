import { SlashCommandBuilder } from "discord.js"
import { Command } from "../types"

const command: Command = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with pong!"),

    run: async (client, interaction) => {
        await interaction.reply("Pong!")
    }
}

export default command