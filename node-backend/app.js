const express = require('express');
const mongoose = require('mongoose')
require('dotenv').config()
const Post = require('./models/posts')

mongoose.connect(process.env.MONGODB_CONNECTION_URI).then(() => {
  console.log("connected to MongoDB")
}).catch(err => {
  console.log("can't connect to databse ", err)
})

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Pequested-With, Content-Type, Accept');
  res.setHeader(
    'Access-Control-Allow-Methods',
    "GET, POST, PATCH, DELETE, OPTIONS"
  )
  next();
})

app.post("/api/posts", (req, res, next) => {
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

})

app.get("/api/posts", async (req, res, next) => {
  await Post.find().then((documents) => {
    // console.log("document..", documents)
    res.status(200).json({
      message: "post fetched succesfully!!!!",
      posts: documents
    })
  });

})

app.delete("/api/posts/:id", async (req, res) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log("res..", result);
    if (result.deletedCount)
      res.status(200).json({
        message: "Post Deleted!!"
      })
  })

})


module.exports = app;