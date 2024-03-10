
//fyi: using JWT for authentication and authorization-> it has a header, payload and sign -> see jwt.io/debugger

//making a model to strore "refresh model"-> one given after "access token" expires

const mongoose = require('mongoose');

const {Schema} = mongoose;

const refreshTokenSchema = Schema({
    token: {type: String, required: true},
    userId: {type: mongoose.SchemaTypes.ObjectId, ref: 'User'}
},
{timestamps: true}

);

module.exports = mongoose.model('RefreshToken', refreshTokenSchema, 'tokens');

//now making a service-> to store JWT token, verify and assign them
// make folder services->JWTService.js