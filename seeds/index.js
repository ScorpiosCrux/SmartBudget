/* This file is ran whenever we want to seed our database */

const mongoose = require('mongoose');
const Transaction = require('../models/transaction')

mongoose.connect('mongodb://localhost:27017/smart-budget');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const seedDB = async() => {
    await Transaction.deleteMany({}); //deletes everything
    const c = new Transaction({description: 'new transaction'});
    await c.save();
}

seedDB();