const jwt = require("jsonwebtoken")

const User = require("../models/User.js")
const { queryAsync } = require("../utils")

// Check for Authorization header and add user attribute to request object
async function ProtectMiddleware(req, res, next) {
    // Break if no Authorization header is set
    if(!req.header("Authorization")) {
        res.send(401)
    }

    // Get token from Authorization header
    const token = req.header("Authorization").split(" ")[1]

    // Read userId from token
    const userId = await new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
            if(error) {
                console.error(error)
                res.send(403)
                reject()
            }

            resolve(decoded.id)
        })
    })

    // Get user from database
    const row = (await queryAsync(`SELECT * FROM users WHERE id = '${userId}'`))[0]
    
    // Create user model
    const user = new User(row)

    // Inject user into request object
    req.user = user

    next()
}

module.exports = ProtectMiddleware 