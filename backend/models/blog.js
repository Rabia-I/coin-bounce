// what ive done so far---> xonnection estabished--> credentials safe--> now making models to store sperate data 

const mongoose = require('mongoose');  // 1) importing mongoose

const {Schema} = mongoose; // 2) destructuring it or else it can look like---> "const Schema = mongoose.Schema; " ur choice

//3) for this model (blog)--> to define it---> we will make an object of schema type---> inside its constructor we will define our model
// 3) b) this is basically telling what our blog attributes will b e.g. title, content, phtoto







const blogSchema = new Schema({
    title: {type: String, required: true}, //4) must b string and required
    content: {type: String, required: true},
    photoPath: {type: String, required: true},
    author: {type: mongoose.SchemaTypes.ObjectId, ref: 'User' }, // 5)  it is the reference taken from the user model, that will b of user type---> logic is that the user should b able to make a blog so once he does that, his name will be used here in this model as an author

},
     //fyi: in mongodb very parameter has an id given to it automatically

     {timestamps: true} // 6) whenever a record (e.g. title, content etc) is added, updated , time timestamp is recorded accordingly

);



// 7) exporting this model--> 'models name', 'schema of model--> has to b same as above', 'with which name we will make this connection in our database--> lets keep it plural'

module.exports = mongoose.model('Blog', blogSchema, 'blogs' );



// 8) go to user.js model--> same there 
