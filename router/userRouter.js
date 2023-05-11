const usersCtrl = require("../controllers/usersCtrl");
const auth = require("../middleware/auth");
const router = require("express").Router();

router.get("/search", auth, usersCtrl.searchUser);
router.patch("/follow", auth, usersCtrl.followUser);
router.patch("/unfollow", auth, usersCtrl.unfollow);
router.get("/suggested_users", auth, usersCtrl.suggestedUsers);
router.patch("/save_post/:postId", auth, usersCtrl.savePost);
router.patch("/close_friend/:id", auth, usersCtrl.savePost);
router.get("/", auth, usersCtrl.getAllUsers);
router.get("/:id", auth, usersCtrl.userDetail);
router.patch("/:id", auth, usersCtrl.updateUser);
router.delete("/:id", auth, usersCtrl.deleteUser);

module.exports = router;