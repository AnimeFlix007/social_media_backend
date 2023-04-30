const auth = require("../middleware/auth");
const router = require("express").Router();
const postCtrl = require("../controllers/postCtrl");

router.get("/", auth, postCtrl.getAllPosts);
router.post("/", auth, postCtrl.createPost);
router.get("/:id", auth, postCtrl.getPost);
router.patch("/:id", auth, postCtrl.updatePost);
router.delete("/:id", auth, postCtrl.deletePost);

module.exports = router;