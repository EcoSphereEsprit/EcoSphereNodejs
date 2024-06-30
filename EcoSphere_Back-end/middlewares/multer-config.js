// import multer, { diskStorage } from "multer"; // Importer multer
// import { join, dirname } from "path";
// import { fileURLToPath } from "url";
// // Les extensions à accepter
// const MIME_TYPES = {
//     "image/jpg": "jpg",
//     "image/jpeg": "jpg",
//     "image/png": "png",
// };
// export default multer({
//     // Configuration de stockage
//     storage: diskStorage({
//         // Configurer l'emplacement de stockage
//         destination: (req, file, callback) => {
//             const __dirname = dirname(fileURLToPath(import.meta.url)); // Récupérer le chemain du dossier courant
//             callback(null, join(__dirname, "../public/images")); // Indiquer l'emplacement de stockage
//         },
//         // Configurer le nom avec lequel le fichier va etre enregistrer
//         filename: (req, file, callback) => {
//             // Remplacer les espaces par des underscores
//             const name = file.originalname.split("").join("_");
//             // Récupérer l'extension à utiliser pour le fichier.
//             const extension = MIME_TYPES[file.mimetype];
//             // Ajouter un timestamp 
//             callback(null, name + Date.now() + "." + extension)
//         },
//     }),
//     // Taille max des images 10Mo
//     limits: 10 * 1024 * 1024,
// }).single("image"); // Le fichier est envoyé dans le body avec nom/clé 'image'

// //.array("images", 5); for more than one
// //  ********************************************************* */
// // const storage = multer.diskStorage({
// //     destination: function (req, file, cb) {
// //         cb(null, 'uploads/');
// //     },
// //     filename: function (req, file, cb) {
// //         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
// //     }
// // });

// // export const upload = multer({
// //     storage: storage,
// //     fileFilter: function (req, file, callback) {
// //         const filetypes = /jpeg|jpg|png/;
// //         const mimetype = filetypes.test(file.mimetype);
// //         const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

// //         if (mimetype && extname) {
// //             return callback(null, true);
// //         } else {
// //             callback('Error: Images Only!');
// //         }
// //     }
// // });



// middleware/upload.js
import multer from 'multer';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Define MIME_TYPES to map MIME types to file extensions
const MIME_TYPES = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const __dirname = dirname(fileURLToPath(import.meta.url)); // Récupérer le chemin du dossier courant
        callback(null, join(__dirname, "../public/images")); // Indiquer l'emplacement de stockage
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + "." + extension);
    }
});

export default multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
}).single('image'); // Le fichier est envoyé dans le body avec nom/clé 'image'
