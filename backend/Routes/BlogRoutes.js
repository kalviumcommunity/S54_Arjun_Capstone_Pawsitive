const express = require("express")
const router = express.Router()

const { createBlog,getAllBlogs,getBlog,postComment, getComments,likeBlog,getSavedBlogs} = require("../Controllers/BlogController")
const { limiter } = require("../rateLimiter")

router.post("/", createBlog)
router.get("/all", getAllBlogs)
router.get("/:pid", getBlog)
router.put("/:blogId/like",limiter, likeBlog);
router.get('/blogs/saved', getSavedBlogs);
// router.put("/:pid", updateBlog)
router.post('/:blogId/comments',limiter, postComment)
router.get('/:blogId/comments', getComments)

module.exports = router