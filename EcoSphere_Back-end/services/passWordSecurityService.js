import { randomBytes, pbkdf2Sync } from 'crypto';
export function generateSalt(length = 16) {
    return randomBytes(length).toString('hex');
}

export function hashPassWordWithSalt(passWord, salt) {
    const iterations = 100000;
    const keyLength = 64;
    const digest = 'sha512';

    const hash = pbkdf2Sync(passWord, salt, iterations, keyLength, digest).toString('hex');
    return hash;

}

export function generateRandomNumberString() {
    return Math.floor(Math.random() * 10000).toString().padStart(4, '0');
}