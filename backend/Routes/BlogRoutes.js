const express = require("express")
const router = express.Router()

const { createBlog,getAllBlogs,getBlog} = require("../Controllers/BlogController")

router.post("/", createBlog)
router.get("/all", getAllBlogs)
router.get("/:pid", getBlog)
// router.put("/:pid", updateBlog)

module.exports = router