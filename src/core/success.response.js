'use strict'

const StatusCode = {
    OK: 200,
    CREATED: 201
}

const ReasonError = {
    OK: 'Success',
    CREATED: 'Created'
}

class SuccessResponses {
    constructor({ message, statusCode = StatusCode.OK, reasonStatusCode = ReasonError.OK, metadata }) {
        this.message = !message ? reasonStatusCode : message
        this.status = statusCode
        this.metadata = metadata
    }

    send(res, headers = {}) {
        return res.status(this.status).json(this)
    }
}


class OK extends SuccessResponses {
    constructor({ message, metadata }) {
        super({ message, metadata })
    }
}

class CREATED extends SuccessResponses {
    constructor({ options = {}, message, statusCode = StatusCode.CREATED, reasonStatusCode = ReasonError.CREATED, metadata }) {
        super({ message, statusCode, reasonStatusCode, metadata })
        this.options = options
    }
}

module.exports = { SuccessResponses, CREATED, OK }