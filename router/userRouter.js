const usersCtrl = require("../controllers/usersCtrl")
const auth = require("../middleware/auth")
const router = require("express").Router()

router.get("/search", auth, usersCtrl.searchUser)

module.exports = router