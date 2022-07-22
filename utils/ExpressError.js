class ExpressError extends Error {
    constructor(msg, statusCode){
        super();
        this.msg = msg;
        this.statusCode = statusCode;
    }
}