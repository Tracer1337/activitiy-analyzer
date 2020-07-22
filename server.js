require("dotenv").config()
const express = require("express")
const { createProxyMiddleware } = require("http-proxy-middleware")

require("./app/utils")
const { createConnection } = require("./database")
const routes = require("./routes")

// Connect to database
global.db = createConnection()

const app = express()

// Support form data
app.use(express.urlencoded({
    extended: true
}))

// Support json
app.use(express.json())

// Proxy vue dev-server
if(process.env.NODE_ENV === "development") {
    app.use("/", createProxyMiddleware({
        target: "http://localhost:3000/",
        ws: true
    }))
}

// Use Routes
app.use("/", routes)

// Start server on port specified in .env
app.listen(process.env.PORT, () => {
    console.log("Server is running on port", process.env.PORT)
})