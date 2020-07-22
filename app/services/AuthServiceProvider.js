const { v4: uuid } = require("uuid")
const bcrypt = require("bcrypt")
const moment = require("moment")

const User = require("../models/User.js")
const { generateJWT } = require("../utils")

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

    // Create new user
    const userId = uuid()
    const user = new User({
        id: userId,
        email,
        password: hash,
        created_at: moment().format("YYYY-MM-DD HH:mm:ss")
    })

    // Store user in database
    await user.store()

    // Generate JWT
    const token = generateJWT({ id: userId })

    return token
}

// Log user in
async function loginUser({ email, password }, res) {
    // Get user with email from database
    const user = await User.findBy("email", email)

    if(!user) {
        res.status(404)
        res.end()
        return
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid) {
        res.status(401)
        res.end()
        return
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