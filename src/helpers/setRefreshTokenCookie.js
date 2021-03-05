// crée un cookie avec un jeton de rafraîchissement qui expire après 7 jours

const setRefreshTokenCookie = (res, refreshToken) => {
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
}

export default setRefreshTokenCookie;