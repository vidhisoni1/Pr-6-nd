const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    username: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('blogs', blogSchema)