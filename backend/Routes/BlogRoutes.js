const express = require("express")
const router = express.Router()

const { createBlog,getAllBlogs,getBlog,postComment, getComments,likeBlog} = require("../Controllers/BlogController")

router.post("/", createBlog)
router.get("/all", getAllBlogs)
router.get("/:pid", getBlog)
router.post("/:blogId/like", likeBlog);
// router.put("/:pid", updateBlog)
router.post('/:blogId/comments', postComment)
router.get('/:blogId/comments', getComments)


module.exports = router