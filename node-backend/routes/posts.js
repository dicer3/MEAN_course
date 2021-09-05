const express = require("express");
const multer = require("multer");

const Post = require('../models/posts')
const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  "image/jpg": "jpg"
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mine type");
    if (isValid) {
      error = null;
    }
    cb(error, "images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split('').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext)
  }
});

const upload = multer({ storage })

router.post("/", upload.single("image"), (req, res, next) => {
  const url = req.protocol + "://" + req.get('host');
  console.log("urll..", url)
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "post sent successfully",
      post: {
        ...createdPost,
        id: createdPost._id
      }
    })
  });

});

router.get("/", async (req, res, next) => {

  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  await postQuery.then((documents) => {
    fetchedPosts = documents
    return Post.count();
  }).then(count => {
    res.status(200).json({
      message: "post fetched succesfully!!!!",
      posts: fetchedPosts,
      maxPosts: count
    })
  });

})

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found!!' })
    }
  });
})

router.put("/:id", upload.single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath
  })
  console.log("post...", post)
  Post.updateOne({ _id: req.params.id }, post).then(result => {
    // if (result.modifiedCount)
    res.status(200).json({ message: "Update successful !" })
    // else
    //   res.status(500).json({ message: "Problem in Updating !!" })
  })
})

router.delete("/:id", async (req, res) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log("res..", result);
    if (result.deletedCount)
      res.status(200).json({
        message: "Post Deleted!!"
      })
  })

})

module.exports = router;