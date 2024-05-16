import Blog from '../models/blog.model.js';
import multer from 'multer';
import mongoose from 'mongoose';

// Configuration de multer pour le stockage d'images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/'); // Le dossier où les images seront stockées
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Nom du fichier
    }
});

const upload = multer({ storage: storage }).single('image');

// Créer un nouveau blog avec image et date fournie
export const createBlog = async (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            // Une erreur multer s'est produite
            return res.status(500).json({ message: err.message });
        } else if (err) {
            // Une autre erreur s'est produite
            return res.status(500).json({ message: err.message });
        }

        // Tout s'est bien passé, le fichier a été téléchargé avec succès
        try {
            const { idAuthor, title, content, date, eventId } = req.body;

            let event = null;
            if (eventId) {
                if (!mongoose.Types.ObjectId.isValid(eventId)) {
                    return res.status(400).json({ message: 'Invalid event ID' });
                }

                event = await Event.findById(eventId);
                if (!event) {
                    return res.status(404).json({ message: 'Event not found' });
                }
            }

            const imagePath = req.file ? req.file.path : ''; // Chemin de l'image

            const newBlogData = {
                idAuthor,
                title,
                content,
                date,
                image: imagePath
            };

            if (event) {
                newBlogData.event = eventId;
            }

            const newBlog = await Blog.create(newBlogData);

            res.status(201).json(newBlog);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
};


// Liste des blogs
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//  Blog by id
export const getBlogById = async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un blog
export const updateBlog = async (req, res) => {
    const { id } = req.params;

    // Vérifiez si l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid blog ID' });
    }

    console.log(`Updating blog with ID: ${id}`);
    console.log('Request body:', req.body);

    const updateData = req.body;

    try {
        // Si la date est fournie, mettez à jour la date du blog
        if (updateData.date) {
            updateData.date = new Date(updateData.date); // Convertir la date en objet Date
        }

        // Si une image est téléchargée, mettez à jour le chemin de l'image
        if (req.file) {
            updateData.image = req.file.path;
        }

        const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedBlog) {
            console.log('Blog not found');
            return res.status(404).json({ message: 'Blog not found' });
        }

        console.log('Blog updated successfully:', updatedBlog);
        res.status(200).json(updatedBlog);
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteBlog = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedBlog = await Blog.findByIdAndDelete(id);
        if (!deletedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

