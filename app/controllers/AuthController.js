const { createUser, loginUser, validateAuth } = require("../services/AuthServiceProvider.js")

async function register(req, res) {
    if(!validateAuth(req, res)) {
        return
    }

    const token = await createUser(req.body)

    res.send({ token })
}

async function login(req, res) {
    if(!validateAuth(req, res)) {
        return
    }

    const token = await loginUser(req.body, res)

    if(token) {
        res.send({ token })
    }
}

async function profile(req, res) {
    res.send(req.user)
}

module.exports = {
    register,
    login,
    profile
}