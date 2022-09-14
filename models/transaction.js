const { ref } = require("joi");
const mongoose = require("mongoose");
const Note = require("./note");
const Schema = mongoose.Schema;

// Allows us to edit what the Schema for a Transaction to be
const TransactionSchema = new Schema({
    images: [{ url: String, filename: String }],
    description: String,
    cost: String,
    date: String,
    category: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    // we're putting this into here because there's usually not many reviews for a Transaction
    notes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Note", // From our exports in review.js
        },
    ],
});

// .post will have already deleted the transaction but we want to get rid
// of the extra notes that were associated.
TransactionSchema.post("findOneAndDelete", async function (doc) {
    // If we found a document because sometimes we may have not found something
    if (doc) {
        // Remove all notes where _id field is in doc.notes array
        await Note.deleteMany({
            _id: {
                $in: doc.notes,
            },
        });
    }
});

module.exports = mongoose.model("Transactions", TransactionSchema);
