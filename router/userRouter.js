const usersCtrl = require("../controllers/usersCtrl");
const auth = require("../middleware/auth");
const router = require("express").Router();

router.get("/search", auth, usersCtrl.searchUser);
router.patch("/follow", auth, usersCtrl.followUser);
router.patch("/unfollow", auth, usersCtrl.unfollow);
router.get("/suggested_users", auth, usersCtrl.suggestedUsers);
router.get("/:id", auth, usersCtrl.userDetail);
router.patch("/:id", auth, usersCtrl.updateUser);

module.exports = router;