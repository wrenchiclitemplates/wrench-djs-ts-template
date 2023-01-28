import Bot from "./lib/Bot"
import { ClientEvents, ChatInputCommandInteraction, SlashCommandBuilder, ModalSubmitInteraction, AutocompleteInteraction } from "discord.js"

export interface Command {
    data: Omit<SlashCommandBuilder, "addBooleanOption" | "addUserOption" | "addChannelOption" | "addRoleOption" | "addAttachmentOption" | "addMentionableOption" | "addStringOption" | "addIntegerOption" | "addNumberOption">;
    run: (client: Bot, interaction: ChatInputCommandInteraction) => Promise<void>;
    modals?: [
        {
            id: string;
            run: (client: Bot, interaction: ModalSubmitInteraction) => Promise<void>;
        }
    ],
    autocomplete?: (client: Bot, interaction: AutocompleteInteraction) => Promise<void>;
}

export class Event<Key extends keyof ClientEvents> {
    constructor(
        public name: Key,
        public run: (client: Bot, ...args: ClientEvents[Key]) => any
    ) { }
}