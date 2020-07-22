const jwt = require("jsonwebtoken")

const User = require("../models/User.js")

// Check for Authorization header and add user attribute to request object
async function ProtectMiddleware(req, res, next) {
    // Break if no Authorization header is set
    if(!req.header("Authorization")) {
        res.send(401)
    }

    // Get token from Authorization header
    const token = req.header("Authorization").split(" ")[1]

    let userId
    
    try {
        // Read userId from token
        userId = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
                if (error) reject()
                resolve(decoded.id)
            })
        })
    } catch {
        // Handle broken token
        res.status(400)
        res.end()
        return
    }

    // Get user from database
    const row = (await queryAsync(`SELECT * FROM users WHERE id = '${userId}'`))[0]
    
    // Create user model
    const user = new User(row)

    // Inject user into request object
    req.user = user

    next()
}

module.exports = ProtectMiddleware 