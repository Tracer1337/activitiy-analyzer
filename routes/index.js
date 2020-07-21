const fs = require("fs")
const express = require("express")

const rootRouter = express.Router()

// Get all routes in current directory
const routes = fs.readdirSync(__dirname)
                .filter(filename => filename !== "index.js")
                .map(filename => [filename.slice(0, -3), require("./" + filename)])

// Apply routes
for(let [route, router] of routes) {
    rootRouter.use("/" + route, router)
}

module.exports = rootRouter