import Blog from '../models/blog.model.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

export const createBlog = async (req, res) => {
    try {
        const { title, description, date,user } = req.body;
        //const userID = req.user.Id; // Assuming you have user ID in req.user from authentication middleware

    const image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

        const blog = new Blog({ title, description, date, image, user/*: userID*/ });
        await blog.save();

        res.status(201).json(blog);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog) {
            res.status(200).json(blog);
        } else {
            res.status(404).json({ error: 'Blog not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateBlog = async (req, res) => {
    try {
        const { title, description, date } = req.body;
        let image = req.body.image;
        if (req.file) {
            // Si une nouvelle image est téléchargée, utilisez son chemin d'accès temporaire
            image = req.file.path;
        }
        const blog = await Blog.findByIdAndUpdate(req.params.id, { title, description, date, image }, { new: true });
        if (blog) {
            res.status(200).json({message:'Blog updated successfully'});
        } else {
            res.status(404).json({ error: 'Blog not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

 

export const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (blog) {
            res.status(200).json({message:'Blog deleted successfully'});
        } else {
            res.status(404).json({ error: 'Blog not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const searchBlog = async (req, res) => {
    const { name } = req.query;
    try {
        const blogs = await Blog.find({ title: new RegExp(name, 'i') }); // Recherche insensible à la casse
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
