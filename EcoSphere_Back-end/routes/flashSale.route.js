import express from 'express';
import { body } from 'express-validator';
import { postFlashSale, findAll, getOneById, updateOneById, deleteOneById } from '../controllers/flashSale.controller.js';
import multerUpload from '../middlewares/multer-config.js';
const router = express.Router();

//* Create a new flash sale with an image
router.route('/post').post(multerUpload,
    [
        body('product').isString(),
        body('price').isNumeric(),
        body('discountPrice').isNumeric(),
        body('startDate').isDate(),
        body('endDate').isDate(),
        body('imageUrl').isString()
    ],
    postFlashSale)

//* Read all flash sales
router.route('/findAll').get(findAll);

//* Retreive one flash sale
router.route('/getOneById/:id').get(getOneById);

//* Update a flash sale
router.route('/updateOneById/:id').put(updateOneById);

//* Delete a flash sale
router.route('/deleteOneById/:id').delete(deleteOneById);

export default router;
