import express from 'express';
import { body } from 'express-validator';
import { addone, findAll, getOneByCode } from '../controllers/coupon.controller.js';
import multer from '../middlewares/multer-config.js';
const router = express.Router();

router.route('/').post(multer,
    body('code').isLength({ min: 5, max: 50 }),
    body('code').isString,
    body('reduction').isNumeric,
    body('dateExipration').isDate,
    addone)

router.route('/').get(findAll);

router.route('/:code').get(getOneByCode);

export default router;
