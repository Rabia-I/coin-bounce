// 1) validation error coming from authcontroller---> register func--->


const {ValidationError} = require('joi');

const errorHandler = (error, req, res, next) => {
    //default error
    let status = 500;
    let data ={
        message:'Internal Server Error'
    }
    //IF IT IS A VALIDATION ERROR --> WELL and good!
    if (error instanceof ValidationError){  // tells us the error ka jou object hai whether its og validation type or not 
        status = 401;
        data.message = error.message;

        return res.status(status).json(data); 
    }



    // if our error is NOT VALIDATION ERROR THN-->checking if error status is the same as 500 we set above if not thn we convert that value of of status (500) to the val of the error coming
    
    
    
    if (error.status){ // checking to see if the coming error has a status naam ka attribute
        status = error.status;  // changes from 500 to whatever coming
    }

    //if error messsage os differnt from the one set above thn change the message value (data) to the one coming message
    if (error.message){
        data.message = error.message;
    }

    return res.status(status).json(data);  //data is in json format



}

module.exports = errorHandler;    //export from here and use in server.js---> go to server.js