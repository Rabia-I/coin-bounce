const mongoose = require ('mongoose');

const {Schema} = mongoose;

const commentSchema = new Schema ({
    content: {type: String, required: true},
    blog: {type: mongoose.SchemaTypes.ObjectId, ref: 'Blog'},       // 1) referring to a blogs-type document

    author: {type: mongoose.SchemaTypes.ObjectId, ref: 'User'}       //2)  referring to a users-type document


},

{timestamps: true}


);


module.exports = mongoose.model('Comment', commentSchema, 'comments' );



//3)  our entire app has 4 models---> the last one will b made after JWT authentication

// 4) NOW OFF TO MAKING "ROUTESSSSS"----> ENDpoints for our API------> (UNTIL NOW ONLY ( in our server.js) we only hv 1 ENDPOINT-------->WITH OUR TESTING DATA "HELLO WORLD", WE WILL NOW REPLACE IT, DEFINE ALLL OUR ENDPOINTS HERE E.G. ----> USER login, register, log out, account create CRUD op, user authentication, users token being refreshed---> all will be done here)


// 5) make a seperate folder "routes"--> index.js file
