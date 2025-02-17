
import express from 'express';
import {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  searchBlog

} from '../controllers/blog.controller.js';
import multer from '../middlewares/multer-config.js';
const router = express.Router();

router.post('/', multer, createBlog);
router.put('/:id', multer, updateBlog);
router.delete('/:id', deleteBlog);
router.get('/getAll', getAllBlogs);
router.get('/getId/:id', getBlogById);
router.get('/search', searchBlog);

export default router;