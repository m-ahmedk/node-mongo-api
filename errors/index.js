/**
 * These custom error classes are used to handle errors in the application. 
 * The purpose of this file is to make the custom error classes easily accessible 
 * and reusable throughout the application. 
 */

const BadRequestError = require('./bad-request')
const ForbiddenError = require('./forbidden')
const NotFoundError = require('./not-found')
const UnauthorizedError = require('./unauthorized')

module.exports = { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError }