const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Allows us to edit what the Schema for a Transaction to be
const TransactionSchema = new Schema({
    description: String,
    cost: String,
    date: String,
    category: String,
    image: String
});

module.exports = mongoose.model('Transactions', TransactionSchema);