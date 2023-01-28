import { Event } from "../types"
import { info } from "../utils/Utils"

export default new Event("ready", (client) => {
    info(`Logged in as ${client.user.tag}!`)
});