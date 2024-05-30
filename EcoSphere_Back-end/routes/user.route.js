import express from 'express';
import { body } from 'express-validator';
import { SignUp, findAll, getOneById, getOneByUserName, login, logout, activateUser, forgotPassWord, resetPassWord} from '../controllers/user.controller.js';
import multer from '../middlewares/multer-config.js';
const router = express.Router();

router
    .route('/signup')
    .post(multer,
        body('username').isLength({ min : 5, max : 50}),
        body('password').isLength({ min : 6, max : 16}),
        body('phoneNumber').isLength({ min : 8, max : 8}),
        SignUp)

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
    .get(login);

router
    .route('/logout')
    .get(logout);
router
    .route('/activateUser/:id')
    .get(activateUser);
router
    .route('/forgetpassword/:username')
    .post(forgotPassWord);
router
    .route('/resetpassword/:id/:token')
    .post(resetPassWord);



export default router;
