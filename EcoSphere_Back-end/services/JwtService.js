import jwt from 'jsonwebtoken';
import * as fs from 'fs';
const configFile = fs.readFileSync('./config/app.config.json', 'utf8');
const configObject = JSON.parse(configFile);
const secretKey = configObject.security.JWTsecretKey;

export function GetValidJwt(claims){
   return jwt.sign(claims, secretKey, { expiresIn: '1h' });
}


