/* This file is ran whenever we want to seed our database */

const mongoose = require("mongoose");
const Transaction = require("../models/transaction");
const transactions = require("./transactions.js");

const test = transactions.prices[0];

mongoose.connect("mongodb://localhost:27017/smart-budget");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Transaction.deleteMany({}); //deletes everything

    const numSeedTransactions = 28; //num of transactions in seed data
    const numTransactions = 20; //num of transactions we want in the db

    for (let i = 0; i < numTransactions; i++) {
        const random = Math.floor(Math.random() * numSeedTransactions);
        const newTransaction = new Transaction({
            author: "630a9dd15edd42db15432666",
            description: transactions.descriptions[random],
            cost: transactions.prices[random],
            date: transactions.dates[random],
            images: [
                {
                    url: "https://res.cloudinary.com/smartbudget/image/upload/v1663120182/SmartBudget/bbd0oyr0vuclvur1ehez.jpg",
                    filename: "SmartBudget/bbd0oyr0vuclvur1ehez",
                },
                {
                    url: "https://res.cloudinary.com/smartbudget/image/upload/v1663120183/SmartBudget/vvyxcrimsgk5gqusg4ff.png",
                    filename: "SmartBudget/vvyxcrimsgk5gqusg4ff",
                },
            ],
            /* category: String */
        });
        await newTransaction.save();
    }
};

/* 
SeedDB returns a promise because it's an async function
*/
seedDB().then(() => {
    mongoose.connection.close();
});
