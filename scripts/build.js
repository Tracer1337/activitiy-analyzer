const fs = require("fs")
const path = require("path")
const { program } = require("commander")
const ora = require("ora")
const util = require("util")
const execAsync = util.promisify(require("child_process").exec)

async function exec(command, title) {
    const spinner = ora(title).start()

    const run = async (command) => {
        const { stderr } = await execAsync(command)

        if (stderr) {
            spinner.fail()
            throw new Error(stderr)
        }
    }

    if (Array.isArray(command)) {
        for(let c of command) {
            await run(c)
        }
    } else {
        await run(c)
    }

    spinner.succeed()
}

const ROOT_DIR = path.join(__dirname, "..")
const BUILD_DIR = path.join(ROOT_DIR, "client", "build")
const OUTPUT_DIR = path.join(ROOT_DIR, "public")

program
    .option("-i, --install", "install npm packages for server and client")
    .requiredOption("-v, --version-number <number>", "version number visible in the commit message")
    .parse(process.argv)

;(async function run() {
    if(program.install) {
        // Install npm packages for server
        await exec("npm install", "Install npm packages for server")
        // Install npm packages for client
        await exec("cd client && npm install", "Install npm packages for client")
    }

    // // Create react production build
    // await exec("cd client && npm run build", "Create react production build")

    // /**
    //  * Put build into desired destination
    //  */
    // const spinner = ora("Put build into desired destination").start()

    // try {
    //     // Remove old react build
    //     fs.rmdirSync(OUTPUT_DIR, { recursive: true })
    
    //     // Move build to output
    //     fs.renameSync(BUILD_DIR, OUTPUT_DIR)
    // } catch (error) {
    //     spinner.fail()
    //     throw new Error(error)
    // }

    // spinner.succeed()

    // Push new version to git
    await exec([
        "git add .",
        `git commit -m "Build version ${program.versionnumber}"`,
        "git push"
    ], "Push new version to git")
})()