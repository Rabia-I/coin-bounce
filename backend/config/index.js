// in this file we will IMPORT all env variables (environment) and EXPORT it then to whichever file needs it will import that variable and use it 


// 1) importing dotenv package and calling config function
const dotenv = require('dotenv').config();

// 2) importing PORT AND MONGODB_CONNECTION_STRING---> correct method is :

const PORT = process.env.PORT;
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const BACKEND_SERVER_PATH = process.env.BACKEND_SERVER_PATH;



// 3) Exporting these variables---> we hv THIS object and these 2 values: port and mongodb_connec

module.exports ={
    PORT,
    MONGODB_CONNECTION_STRING,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    BACKEND_SERVER_PATH
}


// 3) NOW go to each folder that requires these 2 values and first import this file of "./config/index" and thn replace credentials with PORT or MONGO...> go to server.js for "PORT" replacement 

//4) AND GO TO "database/index.js" for MONGODB replacement  

////// !!!!!!! IMP !!!!!!! when u go there knwo that this is what we are doing 1) importing POrt and deleting the actual port wali line------> it SHOULD make sense if u know wassap 