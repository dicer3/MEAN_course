const express = require("express");
const Post = require('../models/posts')
const router = express.Router();

router.post("/", (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: "post sent successfully",
            postId: createdPost._id
        })
    });

});

router.get("/", async (req, res, next) => {
    await Post.find().then((documents) => {
        // console.log("document..", documents)
        res.status(200).json({
            message: "post fetched succesfully!!!!",
            posts: documents
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

router.put("/:id", (req, res, next) => {
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content
    })
    Post.updateOne({ _id: req.params.id }, post).then(result => {
        if (result.modifiedCount)
            res.status(200).json({ message: "Update successful !" })
        else
            res.status(500).json({ message: "Problem in Updating !!" })
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