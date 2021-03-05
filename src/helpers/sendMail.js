import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';
import accessEnv from './accessEnv';
import generateRegisterToken from './generateRegisterToken';

const sendMail = (user, userAgent) => {
    const options = {
        auth: {
            api_user: accessEnv(MAIL_API_USER),
            api_key: accessEnv(MAIL_API_KEY)
        }
    };
    const client = nodemailer.createTransport(sgTransport(options));
    const content = msgTemplate(user.firstName, generateRegisterToken(user));
    const message = {
        from: 'Fast Africa, noreply@fastafrica.org',
        to: user.email,
        subject: 'Création de compte Umoja Funding',
        html: content
    };
    client.sendMail(message, async (e, info) => {
        if (e) return false;
        return true;
    });
}

export default sendMail;