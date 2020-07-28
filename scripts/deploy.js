const fs = require("fs")
const path = require("path")
const { program } = require("commander")
const NodeSSH = require("node-ssh")
const chalk = require("chalk")
const ora = require("ora")
const util = require("util")
const { performance } = require("perf_hooks")
require("dotenv").config({ path: path.join(__dirname, "..", ".env") })

const execAsync = util.promisify(require("child_process").exec)
const ssh = new NodeSSH()

async function exec(command, options) {
    const run = async (command) => {
        const { stderr } = await execAsync(command)

        if (stderr && !(options && options.skipError)) {
            throw new Error(stderr)
        }
    }

    if (Array.isArray(command)) {
        for(let c of command) {
            await run(c)
        }
    } else {
        await run(command)
    }
}

async function run(fn, title) {
    const spinner = ora(title).start()

    try {
        await fn()
    } catch(error) {
        spinner.fail()
        throw new Error(error)
    }

    spinner.succeed()
}

const ROOT_DIR = path.join(__dirname, "..")
const BUILD_DIR = path.join(ROOT_DIR, "client", "build")
const OUTPUT_DIR = path.join(ROOT_DIR, "public")

program
    .option("-b, --build", "create a new react production build")
    .requiredOption("-v, --version-number <number>", "version number visible in the commit message")
    .parse(process.argv)


/**
 * Main function
 */

;(async function() {
    const startTime = performance.now()

    if (program.build) {
        // Create react production build
        await run(createBuild, "Create react production build")

        // Put build into desired destination
        await run(moveBuild, "Put build into desired destination")
    }

    // Push new version to git
    await run(pushToRemote, "Push new version to git")

    // Connect to server via SSH
    await run(connectSSH, "Connect to server")

    // Deploy new version on server
    await run(deploySSH, "Deploy new version")

    console.log(chalk.cyan(`Executed in ${Math.floor((performance.now() - startTime) / 1000 * 100) / 100}s`))
})()


/**
 * Service functions
 */

async function createBuild() {
    await exec("cd client && npm run build")
}

async function moveBuild() {
    try {
        // Remove old react build
        fs.rmdirSync(OUTPUT_DIR, { recursive: true })

        // Move build to output
        fs.renameSync(BUILD_DIR, OUTPUT_DIR)
    } catch (error) {
        throw new Error(error)
    }
}

async function pushToRemote() {
    await exec([
        "git add .",
        `git commit -m "Build version ${program.versionNumber}"`,
        "git push"
    ], { skipError: true })
}

async function connectSSH() {
    await ssh.connect({
        host: process.env.SSH_HOST,
        username: process.env.SSH_USERNAME,
        privateKey: path.resolve(ROOT_DIR, process.env.SSH_PRIVATE_KEY)
    })
}

async function deploySSH() {
    const { stderr } = await ssh.execCommand("sudo git pull && sudo pm2 restart activity-analyzer", { cwd: "/var/www/activity-analyzer" })

    ssh.dispose()

    if(stderr && stderr.indexOf("github.com") === -1) {
        throw new Error(stderr)
    }
}