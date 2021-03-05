import jwt from 'jsonwebtoken';
import accessEnv from './accessEnv';

const checkToken = token => {
    let userId = -1;
    if (token != null) {
        try {
            let jwtToken = jwt.verify(token, accessEnv(JWT_SIGN_SECRET));
            if (jwtToken != null)
                userId = jwtToken.id;
        } catch (e) { }
    }
    return userId;
}

export default checkToken;