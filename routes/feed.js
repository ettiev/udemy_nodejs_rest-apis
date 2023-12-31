const express = require('express');
const { body } = require("express-validator");
const isAuth = require("../middleware/isAuth");

const feedController = require("../controllers/feed");

const router = express.Router();

//  /feed/posts
router.get("/posts", isAuth, feedController.getPosts);

//  /feed/post
router.post("/post", isAuth, [
    body("title").trim().isLength({min: 5}),
    body("content").trim().isLength({min: 5})
], feedController.createPost);

// /feed/post/[postId]
router.get("/post/:postId", isAuth, feedController.getPost);

router.put("/post/:postId", isAuth, [
    body("title").trim().isLength({min: 5}),
    body("content").trim().isLength({min: 5})
], feedController.updatePost)

router.delete("/post/:postId", isAuth, feedController.deletePost);

module.exports = router;