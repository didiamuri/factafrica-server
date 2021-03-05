import jwt from 'jsonwebtoken';
import accessEnv from './accessEnv';
import parseAuthorization from './parseAuthorization';

const getUserId = authorization => {
    let userId = -1;
    let token = parseAuthorization(authorization);
    if (token != null) {
        try {
            let jwtToken = jwt.verify(token, accessEnv(JWT_SIGN_SECRET));
            if (jwtToken != null)
                userId = jwtToken.id;
        } catch (e) {}
    }
    return userId;
}

export default getUserId;