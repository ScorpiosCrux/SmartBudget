const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    description: String,
    cost: String,
    date: String,
    category: String
});

module.exports = mongoose.model('Transactions', TransactionSchema);