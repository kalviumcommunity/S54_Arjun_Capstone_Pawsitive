const Blogs = require("../Models/BlogModel");

const createBlog = async (req, res) => {
  try {
    const { title, headline, category, img, content, createdBy } = req.body;
    const blog = new Blogs({
      title,
      headline,
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

const getAllBlogs = async (req, res) => {
  try {
      const allBlogs = await Blogs.find();
      res.status(200).json(allBlogs);
  } catch (error) {
      console.error('Error getting blogs:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createBlog,
  getAllBlogs
};
