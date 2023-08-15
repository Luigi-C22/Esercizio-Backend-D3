const express = require('express')
const mongoose = require('mongoose')
const PostsModel = require('../models/postModel');

const logger = require('../middlewares/logger');
const isValidPost = require('../middlewares/validatePosts');
const { postBodyParams, validatePostBody } = require('../middlewares/postValidation');

const post = express.Router();

post.get('posts/title', async (req, res) => {
    const { postTitle } = req.query;

    try {
        const postByTitle = await PostsModel.find({
            title: {
                $regex: '.*' + postTitle + '.*',
                $options: 'i',
            }
        })
        if (!postTitle || postTitle.length <= 0) {
            return res.status(400).send({
                statusCode: 404,
                message: `Post with title '${postTitle}' doesn't exist!`,
            });
        }
        res.status(200).send({
            statusCode: 200,
            postByTitle,
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server Error",
            error,
        })

    }
})


// get http://localhost:5050/posts?page=pageSize=20 
post.get('/posts', async (req, res) => {
    const { page = 1, pageSize = 3 } = req.query //questa riga è l'implementazione della 'pagination'
    try {
        const posts = await PostsModel.find()
            .limit(pageSize) //limitiamo i numero di documenti a quello che passiamo nella query
            .skip((page - 1) * pageSize); //saltiamo dall'ultima pagina aperta al primo risultato della successiva

        const totalPosts = await PostsModel.count()

        res.status(200).send({
            statusCode: 200,
            totalPosts: totalPosts,
            currentPage: +page,
            pageSize: +pageSize,
            posts: posts
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server Error",
            error,
        })
    }
});


post.get('/posts/title', async (req, res) => {
    const { postTitle } = req.query;

    try {
        const postByTitle = await PostsModel.find({
            title: {
                $regex: '.*' + postTitle + '.*',
                $options: 'i',
            }
        })

        if (!postByTitle || postByTitle.length <= 0) {
            return res.status(404).send({
                statusCode: 404,
                message: `Post with title: ${postByTitle} not found`
            })
        }
        res.status(200).send({
            statusCode: 200,
            postByTitle,
        });
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server Error",
            error,
        })
    }
})

post.get('/posts/:postId', async (req, res) => {

    const { postId } = req.params;

    try {
        const postById = await PostsModel.findById(postId);
        res.status(200).send({
            statusCode: 200,
            postById,
        });

    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server Error",
            error,
        });
    }
});

post.post('/posts', postBodyParams, validatePostBody, async (req, res) => {

    const newPost = new PostsModel({
        category: req.body.category,
        title: req.body.title,
        cover: req.body.cover,
        readTime: req.body.readTime,
        author: req.body.author,
        content: req.body.content,
    });

    try {
        const post = await newPost.save();

        res.status(201).send({
            statusCode: 201,
            message: "Post saved successfully",
            payload: post,
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error",
            error,
        });
    }
});

post.patch('/posts/:id', async (req, res) => {
    const { id } = req.params

    const postExist = await PostsModel.findById(id)

    if (!postExist) {
        return res.status(404).send({
            statusCode: 404,
            message: `Post with id ${id} not found`
        })
    }
    try {
        const postId = id;
        const dataToUpdate = req.body;
        const options = { new: true };

        const result = await PostsModel.findByIdAndUpdate(postId, dataToUpdate, options)

        res.status(200).send({
            statusCode: 200,
            message: `Post with id ${id} modified successfully`,
            result
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error",
            error,
        });
    }
});


post.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;

    const postExist = await postModel.findById(id)

    if (!postExist) {
        return res.status(404).send({
            statusCode: 404,
            message: `Post with id ${id} not found`
        })
    }

    try {
        const postTodelete = await postModel.findByIdAndDelete(id)
        res.status(200).send({
            statusCode: 200,
            message: `Post with id ${id} deleted successfully`,
        });
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error",
            error,
        });
    }
})

module.exports = post;