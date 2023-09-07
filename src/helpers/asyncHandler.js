const asyncHandler = fn => {
    //cloresure function
    return ((req, res, next) => {
        return fn(req, res, next).catch(next)
    })
}

module.exports = { asyncHandler }