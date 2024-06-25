import express from 'express';
const router = express.Router();
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
router
    .route('/:imageName')
    .get((req, res) => {
        const imageName = req.params.imageName;

        const __dirname = dirname(fileURLToPath(import.meta.url));
        const imagesFolderPath = join(__dirname, '../public/images' + '/' + imageName)

        res.sendFile(imagesFolderPath);

    });

export default router;