// before i started with this--> go to mongodb atlas--> cluster0--> overview, dataservices--> connect--> first option (node.js, DRivers)--> COPY CODE (see 2nd step). make database folder-->index.js file (will contain al database code and connection with db will b established)

// visit mondodb docs to undertstand the basic structure

// 1) importing mongoose
const mongoose = require('mongoose');

                              /////(((((((((1) comment COMING 1st time FROM config/index.js---> i am here to replace credentials of MONGODB_CONNECTION_STRING---> so, import and use)))))))))

                            const {MONGODB_CONNECTION_STRING} = require('../config/index')    //(((((((((2nd coming from same index;  we will use {} these brackets bcz we are "DESTRUCTURING" cz it was being created and passed in an object form in the config/index file)))))))))

// 2) store ur "connection" in the form of string---> copy THAT code here replacing username and pass (get these two by going to mongoDB--> security--> database Access ) and add databse ka name (after "mongodb.net/" and before "?"----> edit----> the following line will be commented after the 3rd comment cz of keeping the credentials safe---> we made .env file--->thn made config/index file and imported .env variables here---> thn called those variables in the respective files---> this case---> this long "bugAuthor with pass..." will b replaced with "MONGODB_CONNECTION_STRING"<-----THE variable made in env and imported from config/index)

// const connectionString = "mongodb+srv://bugAuthor:coinbounce@cluster0.y1xysmg.mongodb.net/coin-bounce?retryWrites=true&w=majority&appName=Cluster0";



                                 ///((((((((((3rd; coming from same index; WE will remove the above line, i am commenting it  ))))))))))


// 3) an async function which will hv our code thru which we will connect to our database
const dbConnect = async () => {

    // 4) adding try and catch so that if the connection fails we know that it HAS

    try{
        const conn = await mongoose.connect(MONGODB_CONNECTION_STRING); // 5) putting the result into variable "conn" so that it can b displayed in the coming console log----> edit from 4TH comment---> it was initially "const conn = await mongoose.connect(connectionString);" NOW---> "const conn = await mongoose.connect(MONGODB_CONNECTION_STRING);"


        //////////    ((((((((((((((((4th coming from same index file;  replacing "connectionString" with "MONGODB_CONNECTION_STRING"-----> go back to .env file ))))))))))))))))

        console.log(`Database connected to host: ${conn.connection.host}`);   // 6) connection established and mssg displayed

    }
    catch(error){
        console.log(`ERROR : ${error}`); // 7) making it a template string by using back-ticks 

    }

}

// 8) exporting this function and calling this function in our server.js file ---> go to server.js top
module.exports = dbConnect;


// 9 ) NOW THE PROBLEM IS : username, pass and PORT (in server.js) are all EXPOSED :/   ---> MAKE .ENV file in the "backend" folder and hide them there----> go to .env