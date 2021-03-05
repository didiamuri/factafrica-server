import jwt from 'jsonwebtoken';
import accessEnv from './accessEnv';
import parseAuthorization from './parseAuthorization';

const getEmail = authorization => {
    let email = -1;
    let token = parseAuthorization(authorization);
    if (token != null) {
        try {
            let jwtToken = jwt.verify(token, accessEnv(JWT_SIGN_SECRET));
            if (jwtToken != null)
                email = jwtToken.email;
        } catch (e) {}
    }
    return email;
}

export default getEmail;