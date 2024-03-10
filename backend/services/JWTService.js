//making tokens for our models

const jwt = require('jsonwebtoken');
const {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} = require('../config/index');

const RefreshToken = require('../models/token');

//moving these two to .env
// const ACCESS_TOKEN_SECRET="b942481542a7a0db5e4cb8a9e85ca17112d307be1238b6b560a185f28dff2aa826052c479c73d81b269d166f4de8163c7da502ca10a22fa492cae6ecd5ec91b2";

//const REFRESH_TOKEN_SECRET="5374f162366e2a464b0ae69859f4cfac92bbb917221858432410c45d7e7984761c9c01bc611095e63d0eb63298ca6874bde910c843547e9e90da8861d47875d5" //got this by "crypto.randomBytes(64).toString('hex') " in terminal


class JWTService{
    //sign access token
    static signAccessToken(payload, expiryTime ){
        return jwt.sign(payload, ACCESS_TOKEN_SECRET, {expiresIn: expiryTime});
    }

    //sign refresh token
       static signRefreshToken(payload, expiryTime){
        return jwt.sign(payload, REFRESH_TOKEN_SECRET, {expiresIn: expiryTime});
    }
    //verify access token -> generating secret keys -> node crypto -> new term write 1/1----> node->const crypto = require('crypto')->crypto.randomBytes(64).toString('hex')----> we get a random string-> copy and store in ACCESS_TOKEN_SECRET

    static verifyAccessToken(token){
        return jwt.verify(token, ACCESS_TOKEN_SECRET);
    } 

     //verify refresh token
     static verifyRefreshToken(token){
        return jwt.verify(token, REFRESH_TOKEN_SECRET);
    }

    //store refresh token
    static async storeRefreshToken(token, userId){
        try{
            const newToken= new RefreshToken({
                token: token,
                userId: userId
            });

            // store in db
            await newToken.save();

        }
        catch(error){
            console.log(error);
        }
    }
    
}
module.exports = JWTService;

//now integrating login and register controller with JWT 

//using cookies based authentication (more secure) -> will not send r token in json ki body instead use cookie-> so another middleware needed

// new terminal ->   npm i cookie-parser
// go to server.js and import it + register our middleware 