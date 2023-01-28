import mongoose from "mongoose"
import mysql from "mysql2"
import fs from "fs"
import path from "path"
import { TOKEN, CLIENT_ID, MYSQL, MONGO_URI } from "../config/config.json"
import { Client, Collection, GatewayIntentBits, ModalSubmitInteraction, AutocompleteInteraction, REST, Routes } from "discord.js"
import { checkConfig, checkMongoCredentials, checkMysqlCredentials, error, info, warn } from "../utils/Utils"
import { Command } from "../types"

export default class Bot extends Client {
    public commands: Collection<string, Command> = new Collection();
    public modals: Collection<
        string,
        (client: Bot, interaction: ModalSubmitInteraction) => any
    > = new Collection();
    public autocompletes: Collection<
        string,
        (client: Bot, interaction: AutocompleteInteraction) => any
    > = new Collection();

    public mysqlConnection: mysql.Connection;
    public mongooseConnection: mongoose.Connection;

    constructor() {
        super({
            intents: [
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildPresences
            ]
        });
    }

    public async loadEvents() {
        const eventFiles = fs.readdirSync(path.join(__dirname, "..", "events"))
        for (const file of eventFiles) {
            const { default: Event } = await import(path.join(__dirname, "..", "events", file))
            this.on(Event.name, Event.run.bind(null, this))
        }
    }

    public async loadCommands(): Promise<Collection<string, Command>> {
        this.commands.clear();

        let commandsDir = path.join(__dirname, "..", "commands");
        let files = fs.readdirSync(commandsDir);
        for (let file of files) {
            let command = await import(path.join(commandsDir, file));
            this.commands.set(command.default.data.name, command.default);
            info(`Loaded command: ${command.default.data.name}`);

            if (command.default.modals && command.default.modals !== undefined) {
                for (let modal of command.default.modals) {
                    this.modals.set(modal.id, modal.run);
                    info(`Loaded modal: ${modal.id}`);
                }
            }

            if (command.default.autocomplete) {
                this.autocompletes.set(command.default.data.name, command.default.autocomplete);
                info(`Loaded autocomplete: ${command.default.data.name}`);
            }
        }

        return this.commands
    }

    public async deploy() {
        let commands = this.commands.map((command) => command.data.toJSON());
        await this.application?.commands.set(commands);

        info("Deployed commands!");
    }

    public async deleteCommands() {
        let rest = new REST({ version: "10" }).setToken(TOKEN);

        rest
            .put(Routes.applicationCommands(CLIENT_ID), { body: [] })
            .catch((err) => error(err));

        warn("Deleted commands!");
    }

    public async connectMySQL() {
        this.mysqlConnection = mysql.createConnection({
            host: MYSQL.HOST,
            user: MYSQL.USER,
            password: MYSQL.PASSWORD,
            database: MYSQL.DB_NAME
        });

        this.mysqlConnection.connect((err) => {
            if (err) {
                error(err);
                process.exit(1);
            } else {
                info("Connected to MySQL database!");
            }
        });

        return this.mysqlConnection;
    }

    public async connectMongoDB() {
        await mongoose.connect(MONGO_URI)
        mongoose.set("strictQuery", false);

        this.mongooseConnection = mongoose.connection;
        this.mongooseConnection.on("error", (err) => {
            error(err);
            process.exit(1);
        });

        info("Connected to MongoDB database!");

        return this.mongooseConnection;
    }

    public async start() {
        info("Starting the bot...")

        if (!checkConfig()) {
            process.exit(1);
        }

        await this.loadEvents();
        await this.loadCommands();

        await this.login(TOKEN);
        await this.deploy();

        if (checkMongoCredentials()) {
            await this.connectMongoDB();
        }

        if (checkMysqlCredentials()) {
            await this.connectMySQL();
        }
    }
}