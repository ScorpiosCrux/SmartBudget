const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Transaction = require('./models/transaction')

mongoose.connect('mongodb://localhost:27017/smart-budget');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/newtransaction', async (req, res) => {
    const transaction = new Transaction({
        description: "This is the first transaction", 
        cost: "$4.99", 
    });
    await transaction.save();
    res.send(transaction);
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});