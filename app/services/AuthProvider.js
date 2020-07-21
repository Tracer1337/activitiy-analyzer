const bcrypt = require("bcrypt")
const { v4: uuid } = require("uuid")
const moment = require("moment")

const { generateJWT, queryAsync } = require("../utils")

// Validate inputs from /register and /login route
function validateAuth(req, res) {
    if(!req.body.email || !req.body.password) {
        res.status(400)
        res.end()
        return false
    }

    return true
}

// Register user
async function registerUser({ email, password }) {
    // Hash password
    const hash = await bcrypt.hash(password, +process.env.SALT_ROUNDS)

    // Store user in database
    const userId = uuid()
    const query = `INSERT INTO users VALUES ('${userId}', '${email}', '${hash}', '${moment().format("YYYY-MM-DD HH:mm:ss")}')`
    await queryAsync(query)

    // Generate JWT
    const token = generateJWT({ id: userId })

    return token
}

// Log user in
async function loginUser({ email, password }) {
    // Get user with email from database
    const user = (await queryAsync(`SELECT * FROM users WHERE email = '${email}'`))[0]

    // Check password
    const isPasswordValid = bcrypt.compare(password, user.password)

    if(!isPasswordValid) {
        res.status(401)
        res.end()
    }

    // Generate JWT
    const token = generateJWT({ id: user.id })

    return token
}

module.exports = {
    registerUser,
    loginUser,
    validateAuth
}