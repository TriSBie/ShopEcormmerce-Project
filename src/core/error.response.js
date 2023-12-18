'use strict'

const ReasonPhrases = require("./reasonPhrases")
const StatusCode = require("./statusCodes")


class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status //config
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.CONFLICT, statusCode = StatusCode.CONFLICT) {
        console.log(message)
        super(message, statusCode);
    }
    getNotice = () => {
        return {
            message: this.message,
            statusCode: this.status
        }
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
        console.log(message)
        super(message, statusCode)
    }
    getNotice = () => {
        return {
            message: this.message,
            statusCode: this.status
        }
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED) {
        console.log(message)
        super(message, statusCode)
    }
    getNotice = () => {
        return {
            message: this.message,
            statusCode: this.statusCode
        }
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = ReasonPhrases.NOT_FOUND, statusCode = StatusCode.NOT_FOUND) {
        super(message, statusCode)
    }

    getNotice() {
        return {
            message: this.message,
            statusCode: this.statusCode
        }
    }
}


class ForbiddenError extends ErrorResponse {
    constructor(message = ReasonPhrases.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
        console.log(message);
        super(message, statusCode)
    }

    getNotice() {
        return {
            message: this.message,
            statusCode: this.statusCode
        }
    }
}
module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError,
    ForbiddenError
}