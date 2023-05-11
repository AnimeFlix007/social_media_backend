const commentCtrl = require("../controllers/commentCtrl");
const auth = require("../middleware/auth");
const router = require("express").Router();

router.get("/:postId", auth, commentCtrl.getPostComments);
router.post("/:postId", auth, commentCtrl.createComment);
router.patch("/:commentId", auth, commentCtrl.updateComment);
router.delete("/:commentId", auth, commentCtrl.deleteComment);

module.exports = router;