//make object = blogController => has all the functions u called in router => import blogController in routes/index.js =>import joi here

const Joi = require('joi');
const fs = require('fs');  // save photo in disk with this nodejs built in module 
const Blog = require('../models/blog');
const {BACKEND_SERVER_PATH} = require('../config/index');
const BlogDTO = require('../dto/blog');
const BlogDetailsDTO = require('../dto/blog-details');
const Comment = require('../models/comment');



const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const blogController = {


//-----------------------------------------

    async create(req, res, next){
    //1. validate req body
    //2. handle photo storage, naming (client side -> base64 encoded string) -> decode -> store -> save photos path in db
    //3. add to db
    //4. return response

    const createBlogSchema = Joi.object({
        title: Joi.string().required(),
        author: Joi.string().regex(mongodbIdPattern).required(),
        content: Joi.string().required(),
        photo: Joi.string().required()
    });

    //validate
    const {error} = createBlogSchema.validate(req.body);

    if(error){
        return next(error); //middleware called if error
    }

    const {title, author, content, photo} = req.body; //if no error-> destructure these-> take them from req body

    //---------------->photo first ->

    //read as buffer
    const buffer = Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64');

    // allot a random name
    const imagePath = `{Date.now()}-${author}.png`;


    // save locally
    //---> make new folder "storage"--> import file system (fs) on top
    try{
        fs.writeFileSync(`storage/${imagePath}` , buffer);

    } catch(error){
        return next(error);
    }
    // ------------photo savedddd !!!!!!



let newBlog;
    //save blog in db -> firstly import blog ka model
    try{
         newBlog = new Blog({
            title,
            author,
            content,
            photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`
            // go to env and store BACKEND_SERVER_PATH-> import in config->import config here
        });
        await newBlog.save();

    }catch(error){
        return next(error);
    }  
    
    //making a dto for blog here
    const blogDto = new BlogDTO(newBlog);

    return res.status(201).json({blog: blogDto}); 

    },

//---------------------------------------------

    async getAll(req, res, next){
        try{
            const blogs = await Blog.find({});

            const blogsDto = [];
            for (let i=0; i < blogs.length; i++){
                const dto = new BlogDTO(blogs[i]);
                blogsDto.push(dto);
            }
            return res.status(200).json({blogs: blogsDto});


        } catch(error){
            return next(error);

        }
    },

//----------------------------------

    async getById(req, res, next){
        //1. validate
        //2. response

        const getByIdSchema = Joi.object({
            id: Joi.string().regex(mongodbIdPattern).required()
        });

        const {error} = getByIdSchema.validate(req.params);

        if(error){
            return next (error);
        }

        let blog;
        const {id} = req.params;

        try{
            blog = await Blog.findOne({_id: id}).populate('author');

        } catch(error){
            return next(error);
        }

        const blogDto = new BlogDetailsDTO(blog);
        return res.status(200).json({blog: blogDto});
    },



// -----------------------------------------------------    





    async update(req, res, next){

        const updateBlogSchema = Joi.object({
        title: Joi.string().required(),
        content: Joi.string().required(),
        author: Joi.string().regex(mongodbIdPattern).required(),
        blogId: Joi.string().regex(mongodbIdPattern).required(),
        photo: Joi.string().required()
        });
        const {error} = updateBlogSchema.validate(req.body);
        const {title, content, author, blogId, photo} = req.body;

        //if update photo-> first delete prev photo
        // thn save new photo

        let blog;
        try{
            blog = await Blog.findOne({_id: blogId});
        } 
        catch(error){
            return next(error);
        }

        if(photo){
            let previousPhoto = blog.photoPath;
            previousPhoto = previousPhoto.split('/').at(-1);

            //delete photo now

            fs.unlinkSync(`storage/${previousPhoto}`);

            //now savw new photo
            const buffer = Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64');

    // allot a random name
    const imagePath = `{Date.now()}-${author}.png`;


    // save locally
    //---> make new folder "storage"--> import file system (fs) on top
    try{
        fs.writeFileSync(`storage/${imagePath}` , buffer);

    } catch(error){
        return next(error);
    }
    // ------------photo savedddd !!!!!!

    //now update blog

    await Blog.updateOne({_id: blogId},
        {title, content, photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`}
        );

        }

        else{
            await Blog.updateOne({_id: blogId}, {title, content});
        }

        return res.status(200).json({message: 'blog updated!'})




    },




    // ------------------------------------
    async delete(req, res, next){
        //validate id
        // delete blog
        //delete comments on this blog

        const deleteBlogSchema = Joi.object({
            id: Joi.string().regex(mongodbIdPattern).required()

        });
        const {error} = deleteBlogSchema.validate(req.params);

        const {id} = req.params;

        try{
            await Blog.deleteOne({_id: id});

            await Comment.deleteMany({blog: id});

        } 
        
        catch(error){
            return next(error);
        }
        return res.status(200).json({message: 'blog deleted !'});




    }

};

module.exports = blogController;