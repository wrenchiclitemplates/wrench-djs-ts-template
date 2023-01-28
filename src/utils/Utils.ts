import chalk from "chalk"

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