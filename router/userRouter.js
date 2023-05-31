const usersCtrl = require("../controllers/usersCtrl");
const auth = require("../middleware/auth");
const router = require("express").Router();

router.get("/profile", auth, usersCtrl.loggedInUserDetails);
router.get("/search", auth, usersCtrl.searchUser);
router.patch("/follow", auth, usersCtrl.followUser);
router.patch("/unfollow", auth, usersCtrl.unfollow);
router.get("/suggested_users", auth, usersCtrl.suggestedUsers);
router.get("/save_post", auth, usersCtrl.getUserSavePosts);
router.patch("/save_post/:postId", auth, usersCtrl.savePost);
router.get("/close_friend/:userId", auth, usersCtrl.getUserCloseFriends);
router.patch("/close_friend/:friendId", auth, usersCtrl.closeFriend);
router.get("/", auth, usersCtrl.getAllUsers);
router.get("/:id", auth, usersCtrl.userDetail);
router.patch("/:id", auth, usersCtrl.updateUser);
router.delete("/:id", auth, usersCtrl.deleteUser);

module.exports = router;