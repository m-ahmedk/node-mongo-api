const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        minLength: 3,
        required: [true, 'Please provide your first name'],
        maxLength: 30,
    },
    lastname: {
        type: String,
        required: [true, 'Please provide your last name'],
        maxLength: 30,
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
        unique: true, // for e.g. if name exists on db, duplicate error message thrown
    },
    password: {
        type: String,
        required: true,
        minLength: [7, 'Please provide atleast 7 characters to continue'],
    },
    zipcode: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true})

// hash password before saving to db
userSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// return name
userSchema.methods.getName = function() {
    return `${this.firstname} ${this.lastname}`;
}

// compare password with existing db password
userSchema.methods.comparePassword = async function(candidatePassword) {
    const samePassword = await bcrypt.compare(candidatePassword, this.password)
    return samePassword
}

module.exports = mongoose.model('users', userSchema)