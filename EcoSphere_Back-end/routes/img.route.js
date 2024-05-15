import express from 'express';
const router = express.Router();

router.route('/:imageName').get((req, res) => {
    const imageName = req.params.imageName;

    const imagePath = 'C:\\Users\\job_j\\Desktop\\node training\\exam training\\public\\images\\' + imageName; // TODO must be generic for everyone

    res.sendFile(imagePath);
});

export default router;