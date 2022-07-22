const express = require('express');     //express allows us to start up a server and define routes
const path = require('path');           //allows us to run code from any path
const mongoose = require('mongoose');   //the interface for interacting with mongoDB
const ejsMate = require('ejs-mate')      //allows us to further extend templating
const methodOverride = require('method-override');  //allows other requests other than GET and POST
const Transaction = require('./models/transaction');//I believe this allows us to use the schema and connect to the db? 
const CatchAsync = require("./utils/CatchAsync")

mongoose.connect('mongodb://localhost:27017/smart-budget');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

/* This parses the request body so that we can use the variables
This is used in app.post('transactions'... */
app.use(express.urlencoded({extended: true}));

//Since HTML only has get and post, we can still use "put" etc with this
// '_method' will be the query string that is encoded in the URL
app.use(methodOverride('_method'))          

/* NOTE:
    When adding a route, order matters a lot here. Each request will take
    the first route possible!
*/

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

app.get('/transactions/:id', CatchAsync(async (req, res, next) => {                  // :id is the id of the transaction
        const transaction = await Transaction.findById(req.params.id)   // Using the id, we find the transaction in the db
        res.render('transactions/show', {transaction})    
}));

app.get('/transactions/:id/edit', async (req, res) => {                  // :id is the id of the transaction
    const transaction = await Transaction.findById(req.params.id)   // Using the id, we find the transaction in the db
    res.render('transactions/edit', {transaction})
});

app.put('/transactions/:id', async (req, res) => {
    const { id } = req.params;
    const transaction = await Transaction.findByIdAndUpdate(id, {...req.body.transaction})    // We spread the array. Basically making the array/dict args
    res.redirect(`/transactions/${transaction._id}`);
})

app.delete('/transactions/:id', async (req, res) => {
    const { id } = req.params;
    await Transaction.findByIdAndDelete(id);
    res.redirect('/transactions');
});

// This could include a bunch of error handling as this is the general route for all errors
app.use((err, req, res, next) => {
    res.send("Uh ohhh, well that's embarassing! Something went terribly wrong :( Please return to the home page!");
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});