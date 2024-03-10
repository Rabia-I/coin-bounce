const mongoose = require ('mongoose');

const {Schema} = mongoose;

const userSchema = new Schema ({           //schema k type type k eik new object 
    name: {type: String, required: true},
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},

},

{timestamps: true}

);



module.exports = mongoose.model('User', userSchema, 'users' );

// the first argument : User--> with THIS name we will import this model... wherever it is needed

// the second arg : userSchema--> all the 4 attributes above---> UNLESS AND UNTIL our database fulfills these attribues, we will NOT store the data into our database

// the third arg : users--> with this name our connection will b saved in r database



// NOW GO TO COMMENTS MODEL