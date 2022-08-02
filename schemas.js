const Joi = require('joi');

module.exports.transactionSchema = Joi.object({
    //Checks if it's an object and required
    transaction: Joi.object({
        description: Joi.string().required(),
        cost: Joi.number().required().min(0),
        date: Joi.string().required(),
    }).required()
});

module.exports.noteSchema = Joi.object({
    note: Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required(),      // this is when body is empty
    }).required()                           // this required is if everything is empty also makes sure that no extra params are passed in.
});