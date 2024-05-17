import express from 'express';
import { body } from 'express-validator';
import { addone, findAll, getOneByUserName} from '../controllers/user.controller.js';
import multer from '../middlewares/multer-config.js';
import { addProduit } from '../controllers/produits.controller.js';
const router = express.Router();

router
    .route('/')
    .post(multer,
        body('username').isLength({ min : 5, max : 50}),
        body('password').isLength({ min : 6, max : 16}),
        body('phoneNumber').isLength({ min : 8, max : 8}),
        addone)

router
    .route('/')
    .get(findAll);

router
    .route('/:username')
    .get(getOneByUserName);

// Define route to add a new product
router.post('/addProduit', addProduit);


    


export default router;
