import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
require('dotenv').config();
import accessEnv from "#root/helpers/accessEnv";

const apiRouter = require('./routes').router;
const PORT = accessEnv('PORT' || 3000);
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static('public'));

app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));

app.use('/api/', apiRouter);

app.use((req, res, next) => {
    const error = new Error('Unable to manage the request');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    return res.status(error.status || 500)
        .json({
            status: error.status || 500,
            message: error.message
        });
});

app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/`);
});
