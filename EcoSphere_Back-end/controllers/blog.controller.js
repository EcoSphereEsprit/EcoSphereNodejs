import express from 'express';
import Blog from '../models/blog.model.js';
import multer from 'multer';


// Configuration de Multer pour le stockage des images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Create a new blog with image upload
export const createBlog = async (req, res) => {
    try {
        const blogData = {
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            image: req.file ? req.file.path : null,
        };
        const blog = new Blog(blogData);
        await blog.save();
        res.status(201).send(blog);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Obtenir tous les blogs
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('comments');
        res.send(blogs);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Obtenir un blog par ID
export const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('comments');
        if (!blog) {
            return res.status(404).send();
        }
        res.send(blog);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Mettre à jour un blog par ID
export const updateBlog = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'date', 'comments'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }
    //Ajouter 28/05
    console.log(`Updating blog with ID: ${id}`);
    console.log('Request body:', req.body);
    //fin ajout
    const updateData = req.body;
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id);
        // Si la date est fournie, mettez à jour la date du blog
        //Ajout 28/05
        if (updateData.date) {
            updateData.date = new Date(updateData.date); // Convertir la date en objet Date
        }

        // Si une image est téléchargée, mettez à jour le chemin de l'image
        if (req.file) {
            updateData.image = req.file.path;
        }
        //fin ajout
        if (!blog) {
            console.log('Blog not found');
            return res.status(404).json({ message: 'Blog not found' });
        }
        console.log('Blog updated successfully:', blog);
        res.status(200).json(blog);
        updates.forEach(update => blog[update] = req.body[update]);
        if (req.file) {
            blog.image = req.file.path;
        }
        await blog.save();
        res.send(blog);
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ message: error.message });
    }
};

// Supprimer un blog par ID
export const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({ message: 'Blog deleted successfully' });
        res.send(blog);
    } catch (error) {
        res.status(500).send(error);
    }
};