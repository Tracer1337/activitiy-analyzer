const jwt = require("jsonwebtoken")

// Generate JSON Web Token
function generateJWT(input) {
    return jwt.sign(input, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TTL + "s" })
}

// Run db.query promise-based
function queryAsync(query) {
    return new Promise((resolve, reject) => {
        db.query(query, (error, result) => {
            if (error) {
                console.error(error)
                reject()
            }

            resolve(result)
        })
    })
}

module.exports = {
    generateJWT,
    queryAsync
}