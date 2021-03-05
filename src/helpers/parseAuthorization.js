
const parseAuthorization = authorization =>
    (authorization != null || authorization != undefined) ? authorization.replace('Bearer ', '') : null;

export default parseAuthorization;