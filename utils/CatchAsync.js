// This is basically a try/catch block for all async function. From 446, explanation in video 441
module.exports = fn => {                                // pass in function "fn"
    return (req, res, next) => {                        // return a function (req, res, next) => { ... }
        fn(req, res, next).catch(next);                 // .catch will catch any errors and then pass them to next
    }
}