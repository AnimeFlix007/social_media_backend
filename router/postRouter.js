const auth = require("../middleware/auth");
const router = require("express").Router();
const postCtrl = require("../controllers/postCtrl");

router.post("/", auth, postCtrl.createPost);
router.get("/", auth, postCtrl.getAllPosts);
router.get("/:id", auth, postCtrl.getPost);

module.exports = router;