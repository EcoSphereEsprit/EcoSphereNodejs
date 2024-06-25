// routes/commentRoutes.js
import express from 'express';

import {
    createComment,
    getAllComments,
    getCommentById,
    updateComment,
    deleteComment


} from '../controllers/comment.controller.js';
const router = express.Router();

router.post('/:blogId', createComment);
router.get('/getAll', getAllComments);
router.get('/getComment/:id', getCommentById);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);
export default router;