const express = require('express');
const mongoose = require('mongoose')
require('dotenv').config()

const postRoutes = require("./routes/posts")

mongoose.connect(process.env.MONGODB_CONNECTION_URI).then(() => {
  console.log("connected to MongoDB")
}).catch(err => {
  console.log("can't connect to databse ", err)
})

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use("/images", express.static("images"))


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Pequested-With, Content-Type, Accept');
  res.setHeader(
    'Access-Control-Allow-Methods',
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  )
  next();
})

app.use("/api/posts", postRoutes)

module.exports = app;