import express from 'express';
import Comment from '../models/comment.model.js';
import { updateBlog } from '../controllers/blog.controller.js';

// Créer un nouveau commentaire
export const createComment = async (req, res) => {
    try {


        const comment = new Comment(req.body);
        console.log(req.body);
        await comment.save();
        // await updateBlog({body: { comments: { comment }  }, params:{id: req.body.blog}});
        res.status(201).send(comment);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};
// Obtenir tous les commentaires
export const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find().populate('user blog');
        res.send(comments);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Obtenir un commentaire par ID
export const getCommentById = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id).populate('user blog');
        if (!comment) {
            return res.status(404).send();
        }
        res.send(comment);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Mettre à jour un commentaire par ID
export const updateComment = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['content', 'date', 'blog', 'user'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).send();
        }

        updates.forEach(update => comment[update] = req.body[update]);
        await comment.save();
        res.send(comment);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Supprimer un commentaire par ID
export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });

        }
        res.status(200).json({ message: 'Comment deleted successfully' });
        res.send(comment);
    } catch (error) {
        res.status(500).send(error);
    }
};