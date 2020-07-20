require("dotenv").config()
const express = require("express")

const router = require("./router")
const { createConnection } = require("./database")

const app = express()

// Support form data
app.use(express.urlencoded())

// Support json
app.use(express.json())

// Use Router
app.use("/", router)

;(async () => {
    // Connect to database
    await createConnection()

    // Start server on port specified in .env
    app.listen(process.env.PORT, () => {
        console.log("Server is running on port", process.env.PORT)
    })
})()