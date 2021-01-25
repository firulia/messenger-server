class HttpError{
}

class HttpNotFound extends HttpError{
    constructor(message,stack = null){
        this.code = 404;
        this.message = message
        this.stack = stack;
    }
}

module.exports = {
    HttpError: HttpError,
    HttpNotFound: HttpNotFound
}