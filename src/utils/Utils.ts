import chalk from "chalk"
import config from "../config/config.json"

export const checkConfig = (): boolean => {
    if (!config.TOKEN || config.TOKEN === "") {
        error("Bot token not found/invalid. Please check config.json and try again.")
        return false
    }

    if (!config.CLIENT_ID || isNaN(Number(config.CLIENT_ID)) || config.CLIENT_ID === "") {
        error("Client ID is not found/invalid. Please check config.json and try again.")
        return false
    }
}

export const checkMysqlCredentials = (): boolean => {
    if (!config.MYSQL.HOST || !config.MYSQL.USER || !config.MYSQL.PASSWORD || !config.MYSQL.DB_NAME) {
        warn("No MySQL database credentials found in config.json, some features may not work")
        return false
    } else {
        return true
    }
}

export const checkMongoCredentials = (): boolean => {
    if (!config.MONGO_URI || config.MONGO_URI === "") {
        warn("No MongoDB URI found in config.json, some features may not work")
        return false
    } else {
        return true
    }
}

export const time = () => {
    let date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    return chalk.gray(`[${date}]`)
}

export const log = (...args: any[]) => {
    let log = `${time()} ${chalk.green("[LOG]", args.shift())}`
    console.log(log, ...args)
}

export const error = (...args: any[]) => {
    let log = `${time()} ${chalk.red("[ERROR]", args.shift())}`
    console.error(log, ...args)
}

export const warn = (...args: any[]) => {
    let log = `${time()} ${chalk.yellow("[WARN]", args.shift())}`
    console.warn(log, ...args)
}

export const info = (...args: any[]) => {
    let log = `${time()} ${chalk.blue("[INFO]", args.shift())}`
    console.info(log, ...args)
}

export const ready = (...args: any[]) => {
    let log = `${time()} ${chalk.green("[READY]", args.shift())}`
    console.log(log, ...args)
}

export const debug = (...args: any[]) => {
    let log = `${time()} ${chalk.magenta("[DEBUG]", args.shift())}`
    console.debug(log, ...args)
}