// 1) to create router, import express
const express = require ('express') ;


//////////((((((((coming 1st time thru authCintroller and importing it...and add authController in the path down below in login))))))))
const authController = require('../controller/authController'); 
const blogController = require('../controller/blogController');
const commentController = require('../controller/commentController');

const auth = require('../middlewares/auth');

// 2) initialise an object
const router = express.Router();


// 3) go to server.js and remove the testing, dummy endpoint of helloworld 

// 4) testing from here instead now
//  router.get('/test', (req, res)=> res.json({msg: 'Working!'}))      // "/test"----> is the endpoint on which this router will work on-----------> the remainig req and res code represents what the res will b when a req is sent on /test wala endpoint


//5) exporting this router and importing it in server.js



// 7) now ignore the testing one and add real routers that will be needed in our app---> for user---->login, register, logout, refresh

// ----------------------------USER-------------------------



  // 8) USER REGISTER // sequence matters---> must b the same in the authController files' obj func---> see login as well---> thn go to authController and see whats inside their func
  router.post('/register', authController.register);
 // 9) USER LOGIN // this will b the post req cz we are sending username and pass----> go to authControler after thsi and add see login and  functionality

 router.post('/login', authController.login);                  // now instead of adding path her (req, res wala) u mae "controller" ka folder and file "authController.js"----> go to this file above

 //////////////(((((((((((((coming from authController; in this u will just add path and dot whichever function u want----> whenever request comes on login, authcontroller main login function gets called----> see authcontroller again )))))))))))))
   //  10) USER LOGOUT //
   router.post('/logout', auth, authController.logout);   
    // 11) USER REFRESH //
router.get('/refresh', authController.refresh);  





    // -----------------------------BLOG----------------
    //12) create
    router.post('/blog', auth, blogController.create);

    //13) get all
    router.get('/blog/all', auth, blogController.getAll);

    //14) get blog by id 
    router.get('/blog/:id', auth, blogController.getById);

    //15) update
    router.put('/blog', auth, blogController.update);

    //16) delete
    router.delete('/blog/:id', auth, blogController.delete);

    // now -> make controller (blogController) ->



    

    // ---------------------COMMENT---------
    //create
    router.post('/comment', auth, commentController.create);

    // get
    router.get('/comment/:id', auth, commentController.getById);

    // now -> make controller (commentController) ->










module.exports = router;

// 6) go to server.js
