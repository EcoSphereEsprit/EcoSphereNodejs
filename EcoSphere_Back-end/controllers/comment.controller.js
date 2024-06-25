

import Blog from '../models/blog.model.js';
import Comment from '../models/comment.model.js';

export const createComment = async (req, res) => {
    try {
        const { content, date,user } = req.body;
        const { blogId } = req.params; // Identifiant du blog auquel le commentaire est associé

        // Récupérer le blog auquel ajouter le commentaire
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        //const userId = req.user.Id;
        // Créer le commentaire
        const comment = new Comment({ content, date, blog: blogId, user/*: userId */});
        await comment.save();

        // Ajouter le commentaire à la liste des commentaires du blog
        blog.comments.push(comment);
        await blog.save();

        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
 
export const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find();
        res.status(200).json(comments);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getCommentById = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id).populate('blog');
        if (comment) {
            res.status(200).json(comment);
        } else {
            res.status(404).json({ error: 'Comment not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (comment) {
            res.status(200).json({message:'Comment updated successfully'});
        } else {
            res.status(404).json({ error: 'Comment not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if (comment) {
            // Trouver le blog associé au commentaire
            const blog = await Blog.findOne({ comments: req.params.id });
            if (blog) {
                // Supprimer l'identifiant du commentaire de la liste des commentaires du blog
                blog.comments.pull(req.params.id);
                await blog.save();
            }
            res.status(200).json({message:'Comment deleted successfully'});
        } else {
            res.status(404).json({ error: 'Comment not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getCommentsByBlogId = async (req, res) => {
    try {
        const { blogId } = req.params;
        
        // Find the blog by its ID
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        
        // Find comments associated with the blog
        const comments = await Comment.find({ blog: blogId });
        
        res.status(200).json(comments);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

 