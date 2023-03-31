const {StatusCodes} = require('http-status-codes')

const pageNotFound = (req, res, next) => {
    res.status(StatusCodes.NOT_FOUND).json({"message": "Route doesn't exist"})
}

module.exports = pageNotFound;

// const pageNotFound = (req, res) => {
//     res.redirect('/api-docs');
// }

// module.exports = pageNotFound;