const mongoose = require('mongoose')
const Schema = mongoose.Schema

const noteSchema = new Schema({
    body: String,
    rating: Number,     // For learning purposes right now
})


module.exports = mongoose.model("Note", noteSchema);

