const jwt = require("jsonwebtoken")

// Generate JSON Web Token
function generateJWT(input) {
    return jwt.sign(input, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TTL + "s" })
}

// Run db.query promise-based
function queryAsync(query) {
    // Replace "null" with NULL
    query = query.replace(/['"]null['"]/g, "NULL")
    
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

// Convert array to list to be used in a SQL query
// Example: [1, 2, 3] => "('1', '2', '3')"
function quotedList(array) {
    return `(${array.map(element => `'${element}'`).join(",")})`
}

module.exports = {
    generateJWT,
    queryAsync,
    quotedList
}