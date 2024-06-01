import express from 'express';
import { body } from 'express-validator';
import { postCoupon, findAll, getOneByCode, updateOneByCode, deleteOneByCode } from '../controllers/coupon.controller.js';
const router = express.Router();

//* Create a new Coupon
router.route('/post').post([
    body('code').isLength({ min: 5, max: 50 }),
    body('code').isString,
    body('reduction').isNumeric,
    body('dateCreation').isDate,
    body('dateExipration').isDate,
    body('status').isString],
    postCoupon)

//* Read all coupons
router.route('/findAll').get(findAll);

//* Retreive one coupon
router.route('/findOneByCode/:code').get(getOneByCode);

//* Update a coupon
router.route('/updateOneByCode/:code').put(updateOneByCode);

//* Delete a coupon
router.route('/deleteByCode/:code').delete(deleteOneByCode);

export default router;

// request.user