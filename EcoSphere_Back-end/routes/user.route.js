import express from 'express';
import { body } from 'express-validator';

import {
    SignUp, findAll, getOneById, getOneByUserName, login, logout,
    activateUser, forgotPassWord, resetPassWord, CreateAdmin, disactivaetUser,
    checkToken, Get2FACode, verify2FACode, updateUser
} from '../controllers/user.controller.js';

import multer from '../middlewares/multer-config.js';
const router = express.Router();

router
    .route('/signup')
    .post(multer, SignUp)

router
    .route('/')
    .get(findAll);

router
    .route('/getone/:username')
    .get(getOneByUserName);
router
    .route('/userbyid/:id')
    .get(getOneById);

router
    .route('/login')
    .post(login);


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
    .route('/resetpassword/:token')
    .post(resetPassWord);

router.route('/').get(findAll);
router.route('/chechToken/:token').get(checkToken);
router.route('/get2FaId/:id').get(Get2FACode);
router.route('/verify2FACode/:id/:code').get(verify2FACode);
router.route('/:username').get(getOneByUserName);
router.route('/createadmin').post(CreateAdmin);
router.route('/disactivaetUser/:id').post(disactivaetUser);
router.route('/updateuser/:userId').patch(multer, updateUser)


export default router;
