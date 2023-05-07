const auth = require("../middleware/auth");
const router = require("express").Router();
const postCtrl = require("../controllers/postCtrl");
const upload = require("../middleware/multer");

router.get("/", auth, postCtrl.getAllPosts);
router.post("/", auth, upload.array("images"), postCtrl.createPost);
router.get("/allimages/:id", auth, postCtrl.getAllImages);
router.get("/recommended", auth, postCtrl.discover);
router.get("/your-posts/:id", auth, postCtrl.getAllUserPosts);
router.patch("/like/:id", auth, postCtrl.likePost);
router.get("/:id", auth, postCtrl.getPost);
router.patch("/:id", auth, postCtrl.updatePost);
router.delete("/:id", auth, postCtrl.deletePost);

module.exports = router;
