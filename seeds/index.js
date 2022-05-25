/* This file is ran whenever we want to seed our database */

const mongoose = require('mongoose');
const Transaction = require('../models/transaction')
const transactions = require('./transactions.js')

const test = transactions.prices[0];

mongoose.connect('mongodb://localhost:27017/smart-budget');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");

})

const seedDB = async() => {
    await Transaction.deleteMany({}); //deletes everything
    const numOfTransactions = 28; //num of transactions in seed data
    for (let i = 0; i < 50; i++){
        const random = Math.floor(Math.random()*numOfTransactions);
        const newTransaction = new Transaction({
            description: transactions.descriptions[random],
            cost: transactions.prices[random],
            date: transactions.dates[random],
            /* category: String */
        })
        await newTransaction.save();
    }
}

seedDB();