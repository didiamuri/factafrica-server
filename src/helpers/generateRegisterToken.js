import jwt from 'jsonwebtoken';
import accessEnv from './accessEnv';

const generateDemoToken = user => jwt.sign({
    id: user.id,
    email: user.email,
    role: user.roleId
}, accessEnv(JWT_SIGN_SECRET), { expiresIn: '3d' });

export default generateDemoToken;