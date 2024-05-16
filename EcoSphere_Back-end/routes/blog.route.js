import express from 'express';
import multer from 'multer';
import { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } from '../controllers/blog.controller.js';
 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const router = express.Router();


// Créer un nouveau blog
router.post('/', createBlog);

// Afficher la liste  de blogs
router.get('/', getAllBlogs);

// affiche chaque  blog par son id
router.get('/:id', getBlogById);

// Route pour mettre à jour un blog
router.put('/:id', upload.single('image'), updateBlog);
// supprimer un blog
router.delete('/:id', deleteBlog);
export default router;