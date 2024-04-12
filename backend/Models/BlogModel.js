const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    commenterId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
    },
});

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    headline: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdBy: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
    },
    likes: {
        type: [String], 
        default: [],
    },
    views: {
        type: Number,
        default: 0,
    },
    comments: [CommentSchema],
});

const Blogs = mongoose.model("Blog", BlogSchema);

module.exports = Blogs;
