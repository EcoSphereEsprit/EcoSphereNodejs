import User from '../models/user.model.js'
import PassToken from '../models/PassToken.js'
import RoleEnum from '../models/roleEnum.js'
import moment from 'moment-timezone';
import { validationResult } from 'express-validator'
import {GetValidJwt} from '../services/JwtService.js'
import {generateSalt, hashPassWordWithSalt} from '../services/passWordSecurityService.js'
import {sendActivationMail, sendBackValidationTemplate, sendPasswordModificationMail} from '../services/mailService.js'
export var BlackList = new Set();
export var LoggedInUsers = new Map();

export function addone(req,res){
    if(!validationResult(req).isEmpty()){
        res.status(400).json({errors : validationResult(req).array()})
    }
    else{
        console.log(req.file)
        User.create({
            username : req.body.username,
            email : req.body.email,
            password : req.body.password,
            phoneNumber : req.body.phoneNumber,
            image : `${req.protocol}://${req.get('host')}/img/${req.file.filename}`
        }

        )
        .then(newUser => {
            res.status(201).json(newUser)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }
}

export async function SignUp(req, res) {
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ errors: validationResult(req).array() });
    }

    const salt = generateSalt();
    try {
        const isUserNameUsed = await User.findOne({ username: req.body.username });
        if (isUserNameUsed) {
            return res.status(409).json({ error: 'Username already taken' });
        }

        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            role: RoleEnum.USER,
            password: hashPassWordWithSalt(req.body.password, salt),
            salt: salt,
            phoneNumber: req.body.phoneNumber,
            image: `${req.protocol}://${req.get('host')}/img/${req.file.filename}`
        });

        const replacements = {
            name: newUser.username,
            link: `127.0.0.1:9090/user/activateUser/${newUser._id}`
        };

        await sendActivationMail(newUser.email, `Hi ${newUser.username} activate your ecoSphere account and enjoy the journy!`,replacements);

        return res.status(201).json(newUser);
    } catch (err) {
        return res.status(500).json(err);
    }
}

export function findAll(req,res){
   User.find({} ,'_id username phoneNumber isActivated email role')
   .then(result => {
        res.status(200).json(result)
   })
   .catch(err =>{
    res.status(500).json(err)
   })
}

export function getOneByUserName (req, res){
    User.findOne({username : req.params.username})
    .then(user => {
        res.status(200).json(user)
    })
    .catch(err => {
        res.status(500).json(err)
    })
}

export function getOneById (req, res){
    User.findOne({_id : req.params.id})
    .then(user => {
        res.status(200).json(user)
    })
    .catch(err => {
        res.status(500).json(err)
    })
}

export function login(req, res) {
    const { username, password } = req.body;

    User.findOne({ username : username })
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        else if(!user.isActivated){
            return res.status(404).json({ message: 'User Account not Activated or banned' });
        }
        const hashedPassword = hashPassWordWithSalt(password, user.salt)
        
        if (hashedPassword !== user.password) {
          return res.status(401).json({ message: 'Incorrect username or password' });
        }
        if(LoggedInUsers.has(user.username)){
            return res.status(200).json({message : 'User already logged in' , token : LoggedInUsers.get(user.username), role : user.role})
        }

        const claims = {
            username: user.username,
            role: user.role,
            Id : user._id          
          };
        let token = GetValidJwt(claims);
        LoggedInUsers.set(user.username, token);
  
        res.status(200).json({ message: 'Login successful', token: token, role : user.role, userId : user._id});
      })
      .catch(err => {
        res.status(500).json({ message: 'Internal server error', error: err });
      });
  }

export function logout(req, res){
    try{
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token is required' });
        }
        const token = authHeader.split(' ')[1];
        BlackList.add(token);
        for (let [key, value] of LoggedInUsers) {
            if (value === token) {
                LoggedInUsers.delete(key);
            }
        }
        res.status(200).json({ message: 'logout successful', token: token });
    }
    catch(err){
        console.error(err);
        res.status(500).json({message : 'inetrnal server error'})
    }
}

 export const activateUser = async (req, res) => {
    try {
      const userId = req.params.id;
      const updatedUser = await User.findByIdAndUpdate(userId, { isActivated : true }, { new: true });
      res.setHeader('Content-Type', 'text/html');
      return res.send(await sendBackValidationTemplate());
    } catch (err) {
        return res.status(500).json({message : "something is wrong contact us for more info thank you"});

    }
}

export const forgotPassWord = async (req, res) =>{
    try{
        var user = await User.findOne({ username : req.params.username});
        if(user){
            var isExsistingTokenForUser = await PassToken.findOne({userId : user._id});
            if(isExsistingTokenForUser){
                await PassToken.findByIdAndDelete(isExsistingTokenForUser._id)
            }
            var token = await PassToken.create({
                userId : user._id
            })
            const replacements = {
                name: user.username,
                link: `127.0.0.1:9090/user/activateUser/${token.token}`
            };
            await sendPasswordModificationMail(user.email,'forgot you password ? no worries :D',replacements)
            return res.status(200).json("mail sent");
        }
    }
    catch(err){
        console.error(err);
        res.status(500).json({message : 'inetrnal server error'})
    }
}

export const resetPassWord = async (req, res) =>{
    try{
    var validatedToken = await PassToken.findOne({token : req.params.token});   
    const addOneHour = () => moment.tz('Africa/Tunis').add(1, 'hour').toDate();
    const now = addOneHour();
    console.log(now);
    if(validatedToken.validUntill > now){
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const salt = user.salt;
        const hashPassword = hashPassWordWithSalt(req.body.password, salt);
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { password: hashPassword },
            { new: true }
        );

        return res.status(201).json({message : `user ${user.username} resetPassword finished`, status : true});

    }

        return res.status(401).json({message : `token expired unauthorized` , status : false})
    }
    catch(err){
        console.error(err);
        res.status(500).json({message : 'inetrnal server error'})
    }
}
