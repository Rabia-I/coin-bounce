const Joi = require('joi');                        //7) validate user input   
const User = require('../models/user');
const bcrypt = require('bcryptjs');               //used for hashing pass and matching pass
const UserDTO = require('../dto/user');           //filtering data in outcome

const JWTService = require('../services/JWTService');

const RefreshToken = require('../models/token');


const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;
      // was added at the password stage in vaidation first point below---> add this expression in the pass line



// 1) whenever request comes, our controller will execute the corresponding logic

// 2) making object having login, register func in it
const authController = {



    //--------------------------------------------------REGISTER--------------------------------------------------

    async register(req, res, next) {

        // 1. vaidate user input (can b done manually or with lib--> lets use library---> npm joi (pck available in node))

        // 8) what should the data b likr--> its type 

        const userRegisterSchema = Joi.object({
            username: Joi.string().min(5).max(30).required(),
            name: Joi.string().max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(passwordPattern).required(), 
            confirmPassword: Joi.ref('password')   
            
        //9) this pattern is a regular expression which indicates that the pass must hv min 8 characters, max 25 char, atleast 1 capital and 1 small letter----> go up and add const passwordPattern----> in confirmpass--> will make sure these two passwords r the same
        }); 

        //10) now that the user input is taken the way WE Want it---> thn we will VALIDATE--> add error--> if error--> null 
        //value--> otherwise users data passed----> this part is DONEEE--> next 2nd point
        const {error} = userRegisterSchema.validate(req.body);


        // 2. if error in validation -> return error via middleware---> if no error thn check-->

        if (error){
            return next(error);   // next throws us to the next middleware--> bcz only 1 errro middleware in server.js so "that" one gets executed only--> now we know if the eroor is validation error or not
        }

        // 3. if email or username is already registered -> return an error-----> if no errors thn ->

        //1) brinigning users data coming in users body request
        const {username, name, email, password}= req.body;

        //2)if email is already registered---> import User model here to get his data and see if he already is there 

        try{
            const emailInUse = await User.exists({email});   //using mongoose func here 

            const usernameInUse = await User.exists({username});

            if (emailInUse){
                const error = {
                    status : 409, //used for conflict such that data already exists

                    message: 'Email already registered, use another email'
                }

                return next(error); //calling our middleware here
            }
// same with  username :

            if (usernameInUse){
                const error = {
                    status : 409, //used for conflict such that data already exists

                    message: 'Username already registered, use another username'
                }

                return next(error); //calling our middleware here
            }
        }
        catch (error){
            return next(error);

        }

        // 4. password hash
        //123ab---> 378ey3hdi8q2878u1jo0* hashing will be done by "npm i bcrytjs"
        const hashedPassword = await bcrypt.hash(password, 10); 
        
        //once hashing done, another nummers added to hashed password after sorting once, 10 sorting grounds--> crypt 
        //handles it itself--> extra data protection

        
        // 5. store user data in db

        let accessToken;
        let refreshToken;
        let user;

        try{
                    const userToRegister = new User({    //check user schema in user.js to add these values as it is
            username,    // key (here): value (in user.js )--> 
            email,   // bcs key and value same names, we can write as only "email"---> changing from "email: email,"
            name, // if name here (key ) is diff from user.js value thn write as keyemail: useremail
            password: hashedPassword
        });

        //storing in db
        user = await userToRegister.save();

        //token generation JWTTT

        accessToken = JWTService.signAccessToken({_id: user._id}, '30m');

        refreshToken = JWTService.signRefreshToken({_id: user._id}, '60m');
// now tokens made send them to client side -> will do in cookies

        }

        catch(error){
            return next(error);
        }


        // storing refresh tokrn in our db -> hint : go to service

        await JWTService.storeRefreshToken(refreshToken, user._id);

        //sending token thru cookies  --> after this part test with postman(when register a new user-> send-> 2 cookies -> access amd refresh token )


        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        });

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        });

        // 6. send res to user
        const userDto = new UserDTO(user);
        return res.status(201).json({user: userDto, auth: true}) //201 is used whenever we create a resource---> key and value of user same so just write user 
        // go to server.js and write "app.use(express.json)); above router"

        
// ##########3)4)5)6)###########

        /////3) Validate user input---> 
        //4) new terminal
        //5) npm i joi
        //6)  import joi--> const Joi = require('joi);

    },










    // ------------------------------------LOGIN----------------------------------------------------------
    async login(req, res, next) {
        //1. validate user input
        //2. if validation error, return error
        //3. match username and pass
        //4. return response

        const userLoginSchema = Joi.object({
            username: Joi.string().min(5).max(30).required(),
            password: Joi.string().pattern(passwordPattern)
        });


        const {error} = userLoginSchema.validate(req.body);
        
        if(error) {
            return next(error);
        }

        const {username, password} = req.body;

        let user;
        
        try{
            // match uername
            user = await User.findOne({username: username});

            if(!user){
                const error = {
                    status: 401,
                    message: 'Invalid username'
                }
                return next(error);
            }

            // match password
            // req.body.password -> hash -> match

            const match = await bcrypt.compare(password, user.password);

            if (!match){
                const error={
                    status: 401,
                    message: 'Invalid password'
                }
                return next(error);
            }
        }
        catch(error){
            return next(error);

        }

        const accessToken= JWTService.signAccessToken({_id: user._id}, '30m');
        const refreshToken = JWTService.signRefreshToken({_id: user._id}, '60m');


        //updatte refresh token in db
        try{
            await RefreshToken.updateOne({
                _id: user._id
            },
            {token: refreshToken},
            {upsert: true}
            
            )

        }
        catch(error){
            return next(error);
        }




        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 *24,
            httpOnly: true
        });

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 *24,
            httpOnly: true
        });




            const userDto = new UserDTO(user);
        return res.status(201).json({user: userDto, auth: true});
    },











    //--------------------------------------------------LOGOUT---------------------------------------------------
    async logout(req, res, next){
    console.log(req);
        // 1. delet refresh token
        const {refreshToken} = req.cookies; //destructuring bcz coming from cookie

        try{
            await RefreshToken.deleteOne({token: refreshToken});

        } catch(error){
            return next (error);
        }

        //3. delete cookie
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        // 2. response to user (now user is unauthorized)

        res.status(200).json({user: null, auth: false});
    },
    // now go make auth.js in middleware 











    //-----------------------------------REFRESH----------------
    async refresh(req, res, next){
        //1. get refreshToken from cookies
        //2. verify refreshToken
        //3. generate new Tokens 
        //4. update db, return response

        const originalRefreshToken = req.cookies.refreshToken;

        let id;
        try{
            id = JWTService.verifyRefreshToken(originalRefreshToken)._id;



        }catch(e){
            const error= {
                status: 401,
                message: 'Unauthorised'
            }
            return next(error);

        }

        try{
            const match = RefreshToken.findOne({_id: id, token: originalRefreshToken});

            if(!match){
                const error = {
                    status: 401,
                    message: 'Unauthorised'
                }
                return next(error);
            }

        } catch(e){
            return next(e);
        }

        try{

            const accessToken = JWTService.signAccessToken({_id: id}, '30m');

            const refreshToken = JWTService.signRefreshToken({_id: id}, '60m');

            await RefreshToken.updateOne({_id:id}, {token: refreshToken});

            res.cookie('accessToken', accessToken, {
                maxAge: 1000 * 60 * 60* 24,
                httpOnly: true
            })


            res.cookie('refreshToken', refreshToken, {
                maxAge: 1000 * 60 * 60* 24,
                httpOnly: true
            })

        } catch(e){
            return next(e);

        }
        const user = await User.findOne({_id: id});
        const userDto = new UserDTO(user);
        return res.status(200).json({user: userDto, auth: true});


    }

}

//3) go to index.js routes and import this there

//OFF TO JWT-> close all files-> new term-> npm i jsonwebtoken-> make another model token.js



module.exports = authController;