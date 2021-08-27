const express = require('express');

const app = express();
console.log("me")
app.use("/api/posts", (req, res, next) => {
    console.log("hi..")
    const posts = [
        {
            id: "nfrf234ht8924",
            title: "First server-side post",
            content: "This is coming from server"
        },
        {
            id: "nfrf234ht8924",
            title: "Second server-side post",
            content: "This is coming from server"
        }
    ];

})


module.exports = app;