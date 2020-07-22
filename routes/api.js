const express = require("express")

const ProtectMiddleware = require("../app/Middleware/ProtectMiddleware")

const AuthController = require("../app/controllers/AuthController.js")
const CategoryController = require("../app/controllers/CategoryController.js")

const router = express.Router()

router.post("/auth/register", AuthController.register)
router.post("/auth/login", AuthController.login)
router.get("/auth", ProtectMiddleware, AuthController.profile)

router.get("/categories", ProtectMiddleware, CategoryController.getAll)
router.post("/categories", ProtectMiddleware, CategoryController.create)
router.put("/categories", ProtectMiddleware, CategoryController.update)
// router.delete("/categories", ProtectMiddleware, CategoryController.delete)

module.exports = router