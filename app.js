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

/* This parses the request body so that we can use the variables
This is used in app.post('transactions'... */
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/transactions', async (req, res) => {
    const transactions = await Transaction.find({});                // Using Transactions we look for everything
    res.render('transactions/index', {transactions} )               // We pass transactions to the EJS template
});

app.get('/transactions/new', async (req, res) => {
    res.render('transactions/new');
})

app.post('/transactions', async(req, res) => {
    const transaction = new Transaction(req.body.transaction);
    await transaction.save();                                       // since this is an asyc function, "await" for the promise to resolve
    res.redirect(`/transactions/${transaction._id}`);               // redirect to the transaction we just created
})

app.get('/transactions/:id', async (req, res) => {                  // :id is the id of the transaction
    const transaction = await Transaction.findById(req.params.id)   // Using the id, we find the transaction in the db
    res.render('transactions/show', {transaction})
});


app.listen(3000, () => {
    console.log('Serving on port 3000');
});