const { ref } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Allows us to edit what the Schema for a Transaction to be
const TransactionSchema = new Schema({
    description: String,
    cost: String,
    date: String,
    category: String,
    image: String,
    // we're putting this into here because there's usually not many reviews for a Transaction
    notes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Note',      // From our exports in review.js 
        }
    ]
});

module.exports = mongoose.model('Transactions', TransactionSchema);