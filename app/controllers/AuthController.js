const { registerUser, loginUser, validateAuth } = require("../services/AuthProvider.js")

async function register(req, res) {
    if(!validateAuth(req, res)) {
        return
    }

    const token = await registerUser(req.body)

    res.send({ token })
}

async function login(req, res) {
    if(!validateAuth(req, res)) {
        return
    }

    const token = await loginUser(req.body)

    res.send({ token })
}

async function profile(req, res) {
    res.send(req.user)
}

module.exports = {
    register,
    login,
    profile
}