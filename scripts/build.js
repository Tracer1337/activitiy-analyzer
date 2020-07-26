const fs = require("fs")
const path = require("path")
const { program } = require("commander")
const chalk = require("chalk")
const util = require("util")
const execAsync = util.promisify(require("child_process").exec)

async function exec(command, title) {
    console.log(chalk.bold(title))
    const { stderr } = await execAsync(command)
    
    if (stderr) {
        console.log(chalk.red("Error executing " + command))
        throw new Error(stderr)
    }

    console.log(chalk.green("Done"))
}

const ROOT_DIR = path.join(__dirname, "..")

program
    .option("-i, --install", "install npm packages for server and client")
    .parse(process.argv)

;(async function run() {
    // Pull newest version from git
    await exec("git pull", "Pull new version from git")

    if(program.install) {
        // Install npm packages for server
        await exec("npm install", "Install npm packages for server")
        // Install npm packages for client
        await exec("cd client && npm install", "Install npm pac kages for client")
    }

    // Create react production build
    await exec("cd client && npm run build", "Create react production build")

    console.log(chalk.bold("Put build into desired destination"))

    // Remove old react build
    fs.rmdirSync(path.join(ROOT_DIR, "public", "app"), { recursive: true })

    // Move client/build to public/app
    fs.renameSync(path.join(ROOT_DIR, "client", "build"), path.join(__dirname, "public", "app"))
})()