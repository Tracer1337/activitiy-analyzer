const path = require("path")
const open = require("opn")
require("dotenv").config({ path: path.join(__dirname, "..", ".env") })

// Open browser on port
open(`http://${process.env.HOST}:${process.env.PORT}`)