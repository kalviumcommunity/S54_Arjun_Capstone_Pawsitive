const Blogs = require("../Models/BlogModel");

const createBlog = async (req, res) => {
  try {
    const { title, summary, category, img, content, createdBy } = req.body;
    const blog = new Blogs({
      title,
      summary,
      category,
      img,
      content,
      createdBy,
    });
    const newBlog = await blog.save();
    res.status(201).json({ message: "Blog Created Successfully", blog:newBlog });
  } catch (error) {
    console.error("Error creating Blog:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {
  createBlog,
};
