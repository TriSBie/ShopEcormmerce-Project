'use strict'

const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409,
    UNAUTHORIZED: 401
}

const ReasonError = {
    FORBIDDEN: "Bad request error",
    CONFLICT: "Conflict Error",
    UNAUTHORIZED: "Not Authorization"
}

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status //config
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonError.CONFLICT, statusCode = StatusCode.CONFLICT) {
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
    constructor(message = ReasonError.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
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
    constructor(message = ReasonError.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED) {
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
module.exports = { ConflictRequestError, BadRequestError, AuthFailureError }