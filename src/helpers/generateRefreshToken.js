import jwt from 'jsonwebtoken';
import accessEnv from './accessEnv';

const generateRefreshToken = (user, ipAddress) => jwt.sign({
    id: user.id,
    ipAddress: ipAddress
}, accessEnv(JWT_SIGN_SECRET), { expiresIn: '7d' });

export default generateRefreshToken;