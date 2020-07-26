const fs = require("fs")
const path = require("path")
const express = require("express")

const rootRouter = express.Router()

// Get all routes in current directory
const routes = fs.readdirSync(__dirname)
                .filter(filename => filename !== "index.js")
                .map(filename => [filename.slice(0, -3), require("./" + filename)])

// Create routes
for(let [route, router] of routes) {
    rootRouter.use("/" + route, router)
}

// Serve static files
rootRouter.use("/", express.static(path.join(__dirname, "..", "public")))

module.exports = rootRouter