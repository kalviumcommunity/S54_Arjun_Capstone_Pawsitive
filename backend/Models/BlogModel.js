const mongoose = require('mongoose')

const BlogSchema = new mongoose.Schema(
  {
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
    img:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    createdBy:{
        type:String,
        required:true,
    },
    dateCreated: {
        type:Date,
        default:Date.now()
    },
    likes: {
      type: [String],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    }
  }
)

const Blogs = mongoose.model("Blog", BlogSchema);

module.exports = Blogs