/**
 * Connect to a MongoDB database using Mongoose, an ODM (Object Document Mapper) for MongoDB
 */

const mongoose = require('mongoose');
const {InternalServerError} = require('../errors/index');

const connect = async (url) => {
    try { 
        await mongoose.connect(url);
        console.log('Connected to DB..')
    }
    catch(error) {
        throw new InternalServerError(`Error connecting to the Mongodb database: ${error}`)
    }
}

module.exports = connect;