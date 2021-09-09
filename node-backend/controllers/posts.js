
const Post = require('../models/posts')

exports.createPost = (req, res) => {
    const url = req.protocol + "://" + req.get('host');
    console.log("urll..", url)
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: "post sent successfully",
            post: {
                ...createdPost,
                id: createdPost._id
            }
        })
    }).catch(error => {
        res.status(500).json({
            message: "Creating Post Failed !!"
        })
    });
}


exports.getAllPOsts = async (req, res) => {
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
    }).catch(error => {
        res.status(500).json({
            message: "Fetching Posts Failed !!"
        });

    });
}

exports.fetchPost = (req, res) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'Post not found!!' })
        }
    }).catch(error => {
        res.status(500).json({
            message: "Fetching Post Failed !!"
        });
    });;
}

exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        creator: req.userData.userId,
        imagePath
    })
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
        if (result.matchedCount)
            res.status(200).json({ message: "Update successful !" })
        else
            res.status(500).json({ message: "Not Authorized !!" })
    }).catch(error => {
        res.status(500).json({
            message: "Updating Post Failed"
        });
    })
}

exports.deletePost = async (req, res) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then((result) => {
        if (result.deletedCount)
            res.status(200).json({ message: "Post Deleted!!" })
        else
            res.status(500).json({ message: "Not Authorized !!" })

    }).catch(error => {
        res.status(500).json({
            message: "Delleting Post Failed"
        });

    });

}