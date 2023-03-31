/**
 * Router that maps specific route URLs to "user" functions. 
 */

const express = require('express')
const { getAllUsers, getUser, createUser, editUser, deleteUser } = require('../controller/users')

const userRouter = express.Router()

userRouter.route('/').get(getAllUsers).post(createUser)
userRouter.route('/:id').get(getUser).patch(editUser).delete(deleteUser)

module.exports = userRouter