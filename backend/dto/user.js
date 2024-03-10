//DTO: defining what kind of data i want; Joi.string().min(5).max(30)

//we expect the INPUT data to b in such a shape and if not thn throw error

// making this so that the output data we send is consistent as well

// filtering out the output: when register 




class UserDTO{
    constructor(user){
        this._id = user._id;
        this.username = user.username;
        this.email = user.email
    }

}
module.exports = UserDTO;   


// go back to authController and import this 