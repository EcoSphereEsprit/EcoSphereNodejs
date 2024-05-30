import * as fs from 'fs';
import jwt from 'jsonwebtoken';
import {BlackList} from '../controllers/user.controller.js'
const configFile = fs.readFileSync('./config/app.config.json', 'utf8');
const configObject = JSON.parse(configFile);
const secretKey = configObject.security.JWTsecretKey;

export function notFoundError (req, res, next) {
    const err = new Error("Not Found")
    err.status = 404
    next(err)
}

export function errorHandler(err, req, res, next) {
    res.status(err.status || 500).json({
        message : err.message
    })
}

export function authenticateToken(req, res, next) {
    if (req.path.includes('/login') || req.path.includes('/logout') || req.path.includes('/signup') 
        || req.path.includes('/activateUser') || req.path.includes('/forgetpassword') || req.path.includes('/resetpassword')) {
        return next();
    }

    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }

    const token = authHeader.split(' ')[1];

    if(BlackList.has(token)){
        return res.status(403).json({ message: 'token expired' });
    }
    console.log('Decoded Token:', jwt.decode(token));

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
}