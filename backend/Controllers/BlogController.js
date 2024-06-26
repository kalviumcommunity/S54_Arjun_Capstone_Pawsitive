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
            comments: [],
        });
        const newBlog = await blog.save();
        res.status(201).json({ message: "Blog Created Successfully", blog: newBlog });
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

const getBlog = async (req, res) => {
    const { pid } = req.params;

    try {
        const blog = await Blogs.findOne({ _id: pid });

        if (!blog) {
            return res.status(404).json({ message: 'blog Not Found', blog });
        }
        res.status(200).json(blog);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Internal Server Error' });
    }
};

const postComment = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { commenterId, content } = req.body;

        const blog = await Blogs.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        blog.comments.push({ commenterId, content, dateCreated: new Date() });

        await blog.save();

        res.status(201).json({ message: 'Comment added successfully', blog });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getComments = async (req, res) => {
    try {
        const { blogId } = req.params;
        const blog = await Blogs.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.status(200).json({ comments: blog.comments });
    } catch (error) {
        console.error('Error getting comments:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const likeBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { userId } = req.body;

        const blog = await Blogs.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const index = blog.likes.indexOf(userId);
        if (index === -1) {
            blog.likes.push(userId);
        } else {
            blog.likes.splice(index, 1);
        }

        await blog.save();

        res.status(200).json({ message: 'Like updated successfully', blog });
    } catch (error) {
        console.error('Error updating like:', error);
        res.status(500).json({ message: 'Internal Server Error' });mo
    }
};
const getSavedBlogs = async (req, res) => {
    const { blogIds } = req.query;
    try {
        const blogs = await Blogs.find({ _id: { $in: blogIds.split(',') } });
        res.status(200).json(blogs);
    } catch (error) {
        console.error('Error getting saved blogs:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
module.exports = {
    createBlog,
    getAllBlogs,
    getBlog,
    postComment,
    getComments,
    likeBlog,
    getSavedBlogs
};
