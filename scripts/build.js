const fs = require("fs")
const path = require("path")
const { program } = require("commander")
const chalk = require("chalk")
const ora = require("ora")
const util = require("util")
const execAsync = util.promisify(require("child_process").exec)

async function exec(command, title) {
    const spinner = ora(title).start()

    const { stderr } = await execAsync(command)

    if (stderr) {
        spinner.fail()
        throw new Error(stderr)
    }

    spinner.succeed()
}

const ROOT_DIR = path.join(__dirname, "..")
const BUILD_DIR = path.join(ROOT_DIR, "client", "build")
const OUTPUT_DIR = path.join(ROOT_DIR, "public", "app")

program
    .option("-i, --install", "install npm packages for server and client")
    .parse(process.argv)

;(async function run() {
    if(program.install) {
        // Install npm packages for server
        await exec("npm install", "Install npm packages for server")
        // Install npm packages for client
        await exec("cd client && npm install", "Install npm packages for client")
    }

    // Create react production build
    await exec("cd client && npm run build", "Create react production build")

    const spinner = ora("Put build into desired destination").start()

    try {
        // Remove old react build
        fs.rmdirSync(OUTPUT_DIR, { recursive: true })
    
        // Move build to output
        fs.renameSync(BUILD_DIR, OUTPUT_DIR)
    } catch (error) {
        spinner.fail()
        throw new Error(error)
    }

    spinner.succeed()
})()