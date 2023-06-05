const auth = require("../middleware/auth");
const router = require("express").Router();
const postCtrl = require("../controllers/postCtrl");

router.get("/all-posts", auth, postCtrl.getAllPosts);
router.post("/", auth, postCtrl.createPost);
router.get("/allimages/:id", auth, postCtrl.getAllImages);
router.get("/explore", auth, postCtrl.discover);
router.get("/recommended", auth, postCtrl.recommendedPosts);
router.get("/your-posts/:id", auth, postCtrl.getAllUserPosts);
router.patch("/like/:id", auth, postCtrl.likePost);
router.get("/:id", auth, postCtrl.getPost);
router.patch("/:id", auth, postCtrl.updatePost);
router.delete("/:id", auth, postCtrl.deletePost);

module.exports = router;
