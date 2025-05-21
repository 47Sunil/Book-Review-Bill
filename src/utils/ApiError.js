// API error class for centralizing API error  

class ApiError extends Error {
    constructor(
        statuseCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message)
        this.statuseCode = statuseCode
        this.data = null
        this.message = message
        this.success = false;
        this.error = errors

        if (stack) {
            this.stack = stack
        }
        else {
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export { ApiError }