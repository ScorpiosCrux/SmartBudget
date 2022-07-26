const Joi = require('joi');

module.exports.transactionSchema = Joi.object({
    //Checks if it's an object and required
    transaction: Joi.object({
        description: Joi.string().required(),
        cost: Joi.number().required().min(0),
        date: Joi.string().required(),
    }).required()
});
