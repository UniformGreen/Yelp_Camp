// Clasa pentru definirea mai usoara a erorilor
class ExpressError extends Error {
    constructor(message, statusCode){
        super(); // super() cheama eroarea
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;