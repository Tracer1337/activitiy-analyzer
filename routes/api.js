const express = require("express")

const ProtectMiddleware = require("../app/Middleware/ProtectMiddleware")

const AuthController = require("../app/controllers/AuthController.js")
const CategoryController = require("../app/controllers/CategoryController.js")
const ActivityController = require("../app/controllers/ActivityController.js")

const router = express.Router()

router.post("/auth/register", AuthController.register)
router.post("/auth/login", AuthController.login)
router.get("/auth", ProtectMiddleware, AuthController.profile)

router.get("/categories", ProtectMiddleware, CategoryController.getAll)
router.post("/categories", ProtectMiddleware, CategoryController.create)
router.put("/categories", ProtectMiddleware, CategoryController.update)
router.delete("/categories", ProtectMiddleware, CategoryController.deletion)

router.get("/activities", ProtectMiddleware, ActivityController.getAll)
router.post("/activities", ProtectMiddleware, ActivityController.create)
router.put("/activities", ProtectMiddleware, ActivityController.update)
router.delete("/activities", ProtectMiddleware, ActivityController.deletion)

module.exports = router