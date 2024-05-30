import express from 'express';
import {
    createComment,
    getAllComments,
    getCommentById,
    updateComment,
    deleteComment
} from '../controllers/comment.controller.js';

const router = express.Router();

// Routes pour les commentaires
router.post('/', createComment);
router.get('/', getAllComments);
router.get('/:id', getCommentById);
router.patch('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router;
