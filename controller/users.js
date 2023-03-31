const { StatusCodes } = require('http-status-codes')
const users = require('../models/users')
const trim_fields = require('../util/trim-strings')
require('dotenv').config()
const bcrypt = require('bcryptjs')
const { GenericError, NotFoundError, UnauthorizedError } = require('../errors/index')
const createResponse = require('../helper/response')

const getAllUsers = async (req, res) => {
    try {
        const _users = await users.find({}).select('-password')
        const response = createResponse('The following users have been found', _users, _users.length, null, null, StatusCodes.OK, true);

        res.status(response.statuscode).json(response)
    }
    catch (err) {
        throw new GenericError(err, err.statusCode)
    }
}

const getUser = async (req, res) => {
    try {
        const id = req.params.id
        const user = await users.findOne({ "_id": id }).select('-password')

        if (!user) {
            throw new NotFoundError(`User with id ${id} not found..`)
        }

        const response = createResponse(`The user with id ${id} has been found`, user, 1, null, null, StatusCodes.OK, true);
        res.status(response.statuscode).json(response)
    }
    catch (err) {
        throw new GenericError(err, err.statusCode)
    }
}

const createUser = async (req, res) => {
    try {
        var params = await trim_fields(req.body)
        params = Object.fromEntries(params)

        const user = await users.create(params)
        const response = createResponse(`The user has been created`, user, 1, null, null, StatusCodes.CREATED, true);

        res.status(response.statuscode).json(response)
    }
    catch (err) {
        throw new GenericError(err, err.statusCode)
    }
}

const editUser = async (req, res) => {
    try {
        var params = await trim_fields(req.body)
        params = Object.fromEntries(params)

        const userId = req.params.id

        let updated_fields = await update_in_db(params, userId)
        let params_updated = Object.keys(updated_fields)

        console.log(`params updated: ${params_updated}`)

        let updated_count = await get_updated_count(updated_fields);

        console.log(`updated_count: ${updated_count}`)

        const response = createResponse(`The user with id ${userId} has been modified`, null, 1, params_updated, updated_count, 
        StatusCodes.OK, true);

       console.log(`response: ${JSON.stringify(response)}`)
       res.status(response.statuscode).json({ data: response })
    }
    catch (err) {
        throw new GenericError(err, err.statusCode)
    }
}

// In the view, the update needs to be seperated between passwords and rest of the fields
// the function works for both cases
const update_in_db = async (_fields, userId) => {
    try {
        let { phonenumber, firstname, lastname, currentPass: curr_password, newPass: new_password, zipcode } = _fields;
        let user = await users.findOne({ "_id": userId }).exec();
        console.log(user)
        if ( !user ) {
            throw new NotFoundError(`User with id ${userId} not found..`)
        }

        var data = {};

        // include if value is not falsy (e.g., undefined, null, 0, false), using the && operator
        Object.assign(data,
            ...(phonenumber ? [{ phonenumber }] : []),
            ...(firstname ? [{ firstname }] : []),
            ...(lastname ? [{ lastname }] : []),
            ...(zipcode ? [{ zipcode }] : [])
          );

          // for password modification
          if (curr_password) {
            const isPassword = await user.comparePassword(curr_password);
            if (!isPassword) {
                throw new UnauthorizedError('You current password is incorrect, Please enter the correct one to continue.');
            }
            else {
                if (new_password) {
                    const salt = await bcrypt.genSalt(10);
                    new_password = await bcrypt.hash(new_password, salt);

                    data['password'] = new_password;
                }
                else {
                    throw new NotFoundError('New password is empty. Please enter your new password to set.');
                }
            }
        }

        await users.findOneAndUpdate({ "_id": userId }, data, { new: true, runValidators: true }).exec();
        return data;
    }
    catch (err) {
        throw new GenericError(err, err.statusCode)
    }
}

const get_updated_count = async (_fields) => {

    const toUpdate = ['phonenumber', 'firstname', 'lastname', 'zipcode'];

    let fieldsUpdated = 0;

    for (const param of toUpdate) {
        if (_fields[param]) {
            fieldsUpdated++;
        }
    }

    if (_fields.currentPass && _fields.newPass) {
        fieldsUpdated++;
    }

    return fieldsUpdated;
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await users.findOneAndUpdate({ "_id": userId }, { isActive: false }, { new: true, runValidators: true })
        if( !user ) {
            throw new NotFoundError(`User with id ${userId} not found..`)
        }

        const response = createResponse(`The user with id ${userId} has been deleted`, null, 1, null, null, StatusCodes.OK, true)
        res.status(response.statuscode).json(response)
    }
    catch (err) {
        throw new GenericError(err, err.statusCode)
    }
}

module.exports = { getAllUsers, getUser, createUser, editUser, deleteUser }