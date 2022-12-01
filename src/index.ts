const { exec } = require("child_process");

function main() {

    const args = process.argv.slice(2)
    if (args.length == 1 && args[0] == '--all') {
        console.log("running all")
        // TODO run all
    } else if (args.length == 2 && args[0] == '--day') {
        runDay(args[1])
    } else {
        console.log("invalid args")
    }
}

async function runDay(day: string) {
    console.log(`running day ${day}`)
    exec(`find ./src -name '*.dat' -type f -exec cp {} ./dist/day${day}/ \;`)
    const s = await import(`./day${day}/index.js`)
    s.f()
}

main()