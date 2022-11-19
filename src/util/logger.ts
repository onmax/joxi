function sensibleData(str: string) {
    const sensibleDataPath = str.match(/(requisitions|institutions|accounts)\/(.[^\/]*)?\/?/)?.[2]
    const sensibleDataQuery = str.match(/(starting_after)=(.[^&]*)?/)?.[2]

    let final = str

    if (sensibleDataPath)
        final = final.replace(sensibleDataPath, "***...***")
    if (sensibleDataQuery)
        final = final.replace(sensibleDataQuery, "***...***")

    return final
}

const hr = Array.from({ length: 80 }, () => "-").join("")
const separator = `\n\n${hr}\n`
export function log(str: string) {
    let emoji, showSeparator
    if (str.startsWith("POST")) emoji = "🚀"
    else if (str.startsWith("GET")) emoji = "📡"
    else if (str.startsWith("Error")) {
        emoji = "🚨"
        showSeparator = true
    } else {
        emoji = (str.includes("access token")) ? "🔓" : "🛰️ "
        showSeparator = true
    }
    console.log(`${emoji}  ${sensibleData(str)}${showSeparator ? separator : ''}`)
}

export function warn(str: string) {
    const emoji = "⚠️"
    console.log(`${emoji}  ${sensibleData(str)}${separator}`)
}
