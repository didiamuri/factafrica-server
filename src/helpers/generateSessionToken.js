import jwt from 'jsonwebtoken';
import accessEnv from './accessEnv';

const generateSessionToken = user => jwt.sign({
    id: user.id,
    email: user.email,
    role: user.roleId
}, accessEnv(JWT_SIGN_SECRET), { expiresIn: '900000' }); //900000ms = 15min in ms

export default generateSessionToken;