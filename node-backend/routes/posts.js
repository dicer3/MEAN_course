const express = require("express");
const multer = require("multer");


const checkauth = require('../middleware/check-auth')
const uploadFile = require("../middleware/upload-file")
const router = express.Router();

const PostController = require("../controllers/posts")

router.post("/", checkauth, uploadFile, PostController.createPost);

router.get("/", PostController.getAllPOsts)

router.get("/:id", PostController.fetchPost)

router.put("/:id", checkauth, uploadFile, PostController.updatePost)

router.delete("/:id", checkauth, PostController.deletePost)

module.exports = router;