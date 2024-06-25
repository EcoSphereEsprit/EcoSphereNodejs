import express from 'express';
import { body } from 'express-validator';
import { SignUp, findAll, getOneById, getOneByUserName, login, logout, activateUser, forgotPassWord, resetPassWord, Get2FACode, updateUser, verify2FACode, checkToken } from '../controllers/user.controller.js';
import multer from '../middlewares/multer-config.js';
const router = express.Router();

router
    .route('/signup')
    .post(multer,
        SignUp)

router
    .route('/')
    .get(findAll);
router.route('/chechToken/:token').get(checkToken);
router.route('/verify2FACode/:id/:code').get(verify2FACode);
router.get('/')
    .route('/getone/:username')
    .get(getOneByUserName);
router
    .route('/userbyid/:id')
    .get(getOneById);

router
    .route('/login')
    .get(login);

router
    .route('/logout')
    .get(logout);
router
    .route('/activateUser/:id')
    .get(activateUser);

    
    router.route('/login').post(login);

router
    .route('/forgetpassword/:username')
    .post(forgotPassWord);

router
    .route('/forgetpassword/:username')
    .post(forgotPassWord);

router
    .route('/resetpassword/:token')
    .post(resetPassWord);

router.route('/').get(findAll);
router.route('/:username').get(getOneByUserName);
router.route('/updateuser/:userId').patch(multer,updateUser);

router.route('/get2FaId/:id').get(Get2FACode);
export default router;
