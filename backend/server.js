//before i started: made new repo in github and copy path. came to files made a new folder "code"---> in its path wrote "cmd" (cmd prompt opens, write)--->git clone "the link of repo" (done)---> make new folders; backend and frontend---->open backend in vscode (cmd--> code . )-->in terminal write "npm init -y" for pck.json file and "npm i express" for installing express---->make server.js file.

const express = require("express"); // 1)importing express (for ref visit express docs)

// ((((((((((((1: comment coming 1st time from database/index.js)))))))
//IMPORTING dbConnect or the " async connection function" here so that we can call that function
const dbConnect = require("./database/index");

//((((((((coming 2nd time from index.js to replace port = 5000 with JUST port--> so importing PORT from config/index---> problem--> names can NOT b same i.e. PORT AND PORT !!!!----> so remove this line "const PORT = PORT;" ))))))))
const { PORT } = require("./config/index");

// coming 4th time from router/index----> importing router

const router = require("./routes/index"); // now below add app.use(router);

//((((((((((((coming 6th time from errorHandler--->import ---> register after dbConnect();--> bcs all middlewares run sequentiallay and we want r error handling to b done just before the response sent-----> noe go back to authControoler ))))))))))))
const errorHandler = require("./middlewares/errorHandler");

const cookieParser = require("cookie-parser"); //JWTservice, token sending thru cookies

const cors = require("cors");

/* const corsOptions = {
  credentials: true,
  origin: ["http://localhost:3000"],
}; */

// ( following command was initilially being used but due to redundant names we r removing it---> just import for now)

//const PORT = PORT;

// 3)defining a port on which listening and req'ing, res'ending will happen

// ((((((((1: comment coming 2nd time from config/index.js ))))))))---> replacing "const PORT = 5000;" with ----> const PORT = PORT--> over rule--> go to database/index;

// ((((((((((((2:comment coming 1st time from index.js)))))))))))) calling that (connecttion) function here------> noe go back to index.js

const app = express(); // 2)making an object for my app named "app"

app.use(cookieParser()); //cookie perser ka middleware is regsitered-> now regsiter and login controller main JWT integrate -> go to authController

// app.use(cors(corsOptions));

app.use(
  cors({
    origin: function (origin, callback) {
      return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" })); /*((((((((coming from authController after register)))))))))))))another middleware that will // ensure that our application can communicate data in json */

app.use(router); // this was added on the 4th visit
dbConnect();
app.use("/storage", express.static("storage"));
app.use(errorHandler);

// 6)a req will come on "/" aka "index" and res will b in json format

// 6) b) after u write this.. run the server again cz in "backend" whenever cahnges are made, they dont get saved..so in terminal--> ctrl C and node server.js  (again..agh!!!)...................> installing nodemon :)-----------> "npm i -D nodemon" ----> "-D" bcz this is r "developing dependency (dev dependency..check package.json and add scripts as well)" and not a "core dependency"

//app.get('/', (req, res) => res.json({msg: 'HELLO WORLD!123'}));

//         ((((((((((((coming 3rd time from router/index and removing the dummy endpoint above "app.get('/', (req, res) => res.json({msg: 'HELLO WORLD!123'})); " ))))))))))))

// 7) once uve added "scripts" in the package.json file... use "npm run dev" to see changes and "npm run start" will ONLY B  USED once the deployment stage begins, the whole app is done building

// 8) express setup DONEE !! "npm run dev" and see automatic changes being impemented... now off to mongodb setup and connecting to r database in the atlas...open new terminal

// 4)making our app listen on this port, if there is any request, sends a response
app.listen(PORT, console.log(`Backend is running on port: ${PORT}`));

// 5)now run "node server.js in terminal and see if backend is running fine.. it IS!"

// 9) "npm i mongoose" in new terminal---->1) mongoose is an ORM that helps us communicate with mongoDb, 2) no need to use mongodb's syntax, use javasvripts' syntax and work with mondoDB, 3) gives security for data validation ( needed when making models)----> next up database/index.js file









//.ENV FILE

//import in config file

//now, for importing these variables to the code---> new terminal "npm i dotenv"
//now for proper formatting---> making a FOLDER "config"---> index.js file--->all in the "backend folder" (outside all other folders)----> go to config NOW


// once u r back from database/index.js---> credentials are NOW SECUREEEE !!!! ;)
// NOW OFF TO MAKING "MONGOOSE MODELS" aka all objects that will hv thier own data---> user.js, blog.js and comment.js--> go to blog.js first