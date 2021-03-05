import express from 'express';
import asyncLib from 'async';
import bcrypt from 'bcrypt';
import parser from 'ua-parser-js';
import Sequelize, { where } from 'sequelize';
import models from '../../database/models';
import hashPassword from '#root/helpers/hashPassword';
import passwordCompareSync from '#root/helpers/passwordCompareSync';
import generateSessionToken from '#root/helpers/generateSessionToken';
import generateRefreshToken from '#root/helpers/generateRefreshToken';
import setRefreshTokenCookie from '#root/helpers/setRefreshTokenCookie';
import getUserId from '#root/helpers/getUserId';
import getEmail from '#root/helpers/getEmail';
import sendMail from '#root/helpers/sendMail';
import checkToken from '#root/helpers/checkToken';

const Op = Sequelize.Op;

exports.router = (() => {
    const app = express.Router();

    /**
     * LAUNCH SERVER
     * @GET
     */
    app.get('/', (req, res) => {
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(
            `<div style="text-align:center; padding-top: 50px;">
            <h1>Welcome to factafrica server</h1>
            <h2>Version 1.0.0</h2>
            </div>`
        );
    });

    /**
     * ROLES ROUTES
     * @POST
     * @PUT
     * @GET
     * @DELETE
     */
    app.post('/role', async (req, res, next) => {
        const userId = getUserId(req.headers['authorization']);
        if (userId < 0)
            return res.status(401).json({
                code: 401,
                status: 'Unauthorized',
                message: 'Votre session a expirée ou vous n\'avez pas d\'autorisation pour accéder à cette ressource'
            });

        if (!req.body.key || !req.body.value) {
            return next(new Error("Informations obligatoires manquantes"));
        }

        try {
            const roleFound = await models.Role.findOne({
                where: { key: req.body.key }
            });

            if (!roleFound) {
                const newRole = await models.Role.create({
                    key: req.body.key,
                    value: req.body.value
                });

                return res.status(201).json({
                    code: 201,
                    status: 'Success',
                    item: newRole
                });
            }
            return next(new Error("Ce role existe deja"));
        } catch (e) {
            return next(e);
        }
    });

    app.get('/roles', async (req, res, next) => {
        try {
            const roles = await models.Role.findAll();
            return res.status(200).json({
                code: 200,
                status: 'Success',
                items: roles
            });
        } catch (e) {
            return next(e);
        }
    });

    /**
     * REQUESTS ROUTES
     * @POST
     * @PUT
     * @GET
     * @DELETE
     */
    app.post('/request', async (req, res, next) => {
        if (!req.body.firstName || !req.body.lastName || !req.body.sex ||
            !req.body.title || !req.body.email || !req.body.country || !req.body.message) {
            return next(new Error("Informations obligatoires manquantes"));
        }

        try {
            const contactFound = await models.Contact.findOne({
                where: { email: req.body.email, status: 0 }
            });
            if (!contactFound) {
                await models.Contact.create({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    sex: req.body.sex,
                    title: req.body.title,
                    email: req.body.email,
                    country: req.body.country,
                    message: req.body.message
                });

                return res.status(201).json({
                    code: 201,
                    status: 'Success'
                });
            }
            return next(new Error('This email already used'));
        } catch (e) {
            return next(e);
        }
    });

    app.get('/requests', async (req, res, next) => {
        try {
            const requests = await models.Contact.findAll();
            return res.status(200).json({
                code: 200,
                status: 'Success',
                items: requests
            });
        } catch (e) {
            return next(e);
        }
    });

    app.get('/requests/news', async (req, res, next) => {
        const userId = getUserId(req.headers['authorization']);
        if (userId < 0)
            return res.status(401).json({
                code: 401,
                status: 'Unauthorized',
                message: 'Votre session a expirée ou vous n\'avez pas d\'autorisation pour accéder à cette ressource'
            });

        try {
            const requests = await models.Contact.findAll({
                where: { status: 0 }
            });
            return res.status(200).json({
                code: 200,
                status: 'Success',
                items: requests
            });
        } catch (e) {
            return next(e);
        }
    });

    app.put('request/:id', async (req, res, next) => {
        const userId = getUserId(req.headers['authorization']);
        if (userId < 0)
            return res.status(401).json({
                code: 401,
                status: 'Unauthorized',
                message: 'Votre session a expirée ou vous n\'avez pas d\'autorisation pour accéder à cette ressource'
            });

        if (!req.params.id) return next(new Error("Informations obligatoires manquantes"));

        try {
            const requestFound = await models.Contact.findByPk(req.params.id);
            if (requestFound) {
                requestFound.update({ status: 1 }, {
                    where: { id: requestFound.id }
                });
                return res.status(201).json({
                    code: 201,
                    status: 'Success'
                });
            }
            return next(new Error("Request not exist"));
        } catch (e) {
            next(e);
        }
    });

    app.delete('/request/:id', async (req, res, next) => {
        const userId = getUserId(req.headers['authorization']);
        if (userId < 0)
            return res.status(401).json({
                code: 401,
                status: 'Unauthorized',
                message: 'Votre session a expirée ou vous n\'avez pas d\'autorisation pour accéder à cette ressource'
            });

        if (!req.params.id) return next(new Error("Informations obligatoires manquantes"));

        try {
            await models.Contact.destroy({ where: { id: req.params.id } });
            return res.status(200).json({
                code: 200,
                status: 'Success'
            });
        } catch (e) {
            return next(e)
        }
    });

    /**
     * USERS ROUTES
     * @POST
     * @PUT
     * @GET
     * @DELETE
     */
    app.post('/user/add', async (req, res, next) => {
        // const userId = getUserId(req.headers['authorization']);
        // const userAgent = parser(req.headers['user-agent']);
        // if (userId < 0)
        //     return res.status(401).json({
        //         code: 401,
        //         status: 'Unauthorized',
        //         message: 'Votre session a expirée ou vous n\'avez pas d\'autorisation pour accéder à cette ressource'
        //     });

        if (!req.body.roleId || !req.body.firstName || !req.body.lastName ||
            !req.body.sex || !req.body.birthPlace || !req.body.birthAt || 
            !req.body.email || !req.body.password || !req.body.phoneNumber || 
            !req.body.address) {
            return next(new Error("Informations obligatoires manquantes"));
        }

        try {
            const userFound = await models.User.findOne({
                where: { email: req.body.email }
            });
            if (!userFound) {
                const newUser = await models.User.create({
                    roleId: req.body.roleId,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    sex: req.body.sex,
                    birthPlace: req.body.birthPlace,
                    birthAt: req.body.birthAt,
                    email: req.body.email,
                    password: hashPassword(req.body.password),
                    phoneNumber: req.body.phoneNumber,
                    address: req.body.address,
                    verified: true,
                    status: 1
                });

                // sendMail(newUser, userAgent);

                return res.status(201).json({
                    code: 201,
                    status: 'Success',
                    items: newUser
                });
            }
            return next(new Error('This email already used'));
        } catch (e) {
            return next(e);
        }
    });
    
    app.post('/user/register', async (req, res, next) => {
        const userId = getUserId(req.headers['authorization']);
        const userAgent = parser(req.headers['user-agent']);
        if (userId < 0)
            return res.status(401).json({
                code: 401,
                status: 'Unauthorized',
                message: 'Votre session a expirée ou vous n\'avez pas d\'autorisation pour accéder à cette ressource'
            });

        if (!req.body.roleId || !req.body.firstName || !req.body.lastName ||
            !req.body.sex || !req.body.email) {
            return next(new Error("Informations obligatoires manquantes"));
        }

        try {
            const userFound = await models.User.findOne({
                where: { email: req.body.email }
            });
            if (!userFound) {
                const newUser = await models.User.create({
                    roleId: req.body.roleId,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    sex: req.body.sex,
                    email: req.body.email
                });

                sendMail(newUser, userAgent);

                return res.status(201).json({
                    code: 201,
                    status: 'Success',
                    items: newUser
                });
            }
            return next(new Error('This email already used'));
        } catch (e) {
            return next(e);
        }
    });

    app.put('/user/account-activation/:token', async (req, res, next) => {
        const userId = checkToken(req.params.token);
        if (userId)
            return res.status(401).json({
                code: 401,
                status: 'Unauthorized',
                message: 'Votre session a expirée ou vous n\'avez pas d\'autorisation pour accéder à cette ressource'
            });

        if (!req.body.birthPlace || !req.body.birthAt || !req.body.password) {
            return next(new Error("Informations obligatoires manquantes"));
        }

        try {
            const userFound = await models.User.findByPk(userId);
            if (userFound) {
                await models.User.update({
                    firstName: (req.body.firstName ? req.body.firstName : userFound.firstName),
                    lastName: (req.body.lastName ? req.body.lastName : userFound.lastName),
                    sex: (req.body.sex ? req.body.sex : userFound.sex),
                    birthPlace: req.body.birthPlace,
                    birthAt: req.body.birthAt,
                    password: hashPassword(req.body.password),
                    verified: true,
                    status: 1
                }, {
                    where: { id: userId }
                });
                return res.status(201).json({
                    code: 201,
                    status: 'Success'
                });
            }
            return next(new Error('This account doest not exist'));
        } catch (e) {
            return next(e);
        }
    });

    app.post('/user/signin', async (req, res, next) => {
        if (!req.body.email || !req.body.password) {
            return next(new Error("Informations obligatoires manquantes!"));
        }
        asyncLib.waterfall([
            (done) => {
                models.User.findOne({
                    where: { email: req.body.email },
                    attributes: ['id', 'firstName', 'lastName', 'sex', 'birthPlace', 'birthAt', 'biography', 'email', 'password', 'phoneNumber', 'address', 'webLinks', 'settings', 'avatar', 'createdAt', 'updatedAt'],
                    include: [{
                        model: models.Role,
                        as: "role",
                        attributes: ['id', 'key', 'value'],
                        required: true
                    }]
                })
                    .then((userFound) => {
                        done(null, userFound);
                    })
                    .catch((e) => {
                        return next(e);
                    })
            },
            (userFound, done) => {
                if (userFound) {
                    if (userFound.status == 0)
                        return next(new Error('Votre compte n\'est pas activé ou est bloqué, veuillez contacter votre administrateur !'));

                    bcrypt.compare(req.body.password, userFound.password, (err, isValid) => {
                        done(null, userFound, isValid);
                    });
                } else {
                    return next(new Error('Le nom d\'utilisateur ou le mot de passe est incorrect'));
                }
            },
            (userFound, isValid, done) => {
                if (isValid) {
                    userFound.update({ sessionAt: new Date() });
                    done(userFound);
                } else {
                    return next(new Error('Le nom d\'utilisateur ou le mot de passe est incorrect'));
                }
            }
        ], (userFound) => {
            if (userFound) {
                const refreshToken = generateRefreshToken(userFound, req.ip);

                userFound.update({ refreshToken: refreshToken }, {
                    where: { id: userFound.id }
                });

                setRefreshTokenCookie(res, refreshToken);

                return res.status(200).json({
                    code: 200,
                    status: 'Success',
                    items: userFound,
                    jwtToken: generateSessionToken(userFound)
                })
            }
            return next(new Error('Une erreur interne s\'est produite'));
        });
    });

    app.get('/user/infos', async (req, res, next) => {
        const userId = getUserId(req.headers['authorization']);
        if (userId < 0)
            return res.status(401).json({
                code: 401,
                status: 'Unauthorized',
                message: 'Votre session a expirée ou vous n\'avez pas d\'autorisation pour accéder à cette ressource'
            });

        try {
            const userInfos = await models.User.findOne({
                where: { id: userId },
                attributes: ['id', 'firstName', 'lastName', 'sex', 'birthPlace', 'birthAt', 'biography', 'email', 'phoneNumber', 'address', 'webLinks', 'settings', 'avatar', 'createdAt', 'updatedAt'],
                include: [{
                    model: models.Role,
                    as: "role",
                    attributes: ['id', 'key', 'value'],
                    required: true
                }]
            });
            return res.status(200).json({
                code: 200,
                status: 'Success',
                item: userInfos
            });
        } catch (e) {
            return next(e);
        }
    });

    /**
     * COUNTRIES ROUTES
     * @POST
     * @PUT
     * @GET
     * @DELETE
     */
    app.post('/country', async (req, res, next) => {
        const userId = getUserId(req.headers['authorization']);
        if (userId < 0)
            return res.status(401).json({
                code: 401,
                status: 'Unauthorized',
                message: 'Votre session a expirée ou vous n\'avez pas d\'autorisation pour accéder à cette ressource'
            });

        if (!req.body.code || !req.body.country) {
            return next(new Error("Informations obligatoires manquantes"));
        }

        try {
            const countryFound = await models.Country.findOne({
                where: { code: req.body.code, country: req.body.country }
            });

            if (!countryFound) {
                const newCountry = await models.Country.create({
                    code: req.body.code,
                    country: req.body.country
                });
                return res.status(201).json({
                    code: 201,
                    status: 'Success',
                    item: newCountry
                });
            }
            return next(new Error("Ce pays existe deja"));
        } catch (e) {
            return next(e);
        }
    });

    app.get('/countries', async (req, res, next) => {
        try {
            const countries = await models.Country.findAll();
            return res.status(200).json({
                code: 200,
                status: 'Success',
                items: countries
            });
        } catch (e) {
            return next(e);
        }
    });

    /**
     * CATEGORIES ROUTES
     * @POST
     * @PUT
     * @GET
     * @DELETE
     */
    app.post('/post/category', async (req, res, next) => {
        const userId = getUserId(req.headers['authorization']);
        if (userId < 0)
            return res.status(401).json({
                code: 401,
                status: 'Unauthorized',
                message: 'Votre session a expirée ou vous n\'avez pas d\'autorisation pour accéder à cette ressource'
            });

        if (!req.body.title) {
            return next(new Error("Informations obligatoires manquantes"));
        }

        try {
            const categoryFound = await models.Category.findOne({
                where: { title: req.body.title }
            });

            if (!categoryFound) {
                const newCategory = await models.Category.create({
                    title: req.body.title
                });
                return res.status(201).json({
                    code: 201,
                    status: 'Success',
                    item: newCategory
                });
            }
            return next(new Error("Cette catégory existe deja"));
        } catch (e) {
            return next(e);
        }
    });

    app.get('/categories', async (req, res, next) => {
        try {
            const categories = await models.Category.findAll();
            return res.status(200).json({
                code: 200,
                status: 'Success',
                items: categories
            });
        } catch (e) {
            return next(e);
        }
    });

    /**
     * POSTS ROUTES
     * @POST
     * @PUT
     * @GET
     * @DELETE
     */
    app.post('/post', async (req, res, next) => {
        const userId = getUserId(req.headers['authorization']);
        if (userId < 0)
            return res.status(401).json({
                code: 401,
                status: 'Unauthorized',
                message: 'Votre session a expirée ou vous n\'avez pas d\'autorisation pour accéder à cette ressource'
            });

        if (!req.body.categoryId || !req.body.countryId || !req.body.title ||
            !req.body.shortDescruption || !req.body.description || !req.body.image) {
            return next(new Error("Informations obligatoires manquantes"));
        }

        try {
            const postFound = await models.Post.findOne({
                where: { title: req.body.title }
            });

            if (!postFound) {
                const newPost = await models.Post.create({
                    categoryId: req.body.categoryId,
                    userId: userId,
                    countryId: req.body.countryId,
                    title: req.body.title,
                    shortDescruption: req.body.shortDescruption,
                    description: req.body.description,
                    image: req.body.image
                });
                return res.status(201).json({
                    code: 201,
                    status: 'Success',
                    item: newPost
                });
            }
            return next(new Error("Cette catégory existe deja"));
        } catch (e) {
            return next(e);
        }
    });

    app.get('/posts', async (req, res, next) => {
        try {
            const posts = await models.Post.findAll({
                attributes: ['id', 'title', 'shortDescruption', 'description', 'image', 'status', 'createdAt', 'updatedAt', 'deletedAt'],
                include: [
                    { model: models.Category, as: "category", attributes: ['id', 'title'], required: true },
                    { model: models.User, as: "user", attributes: ['id', 'firstName', 'lastName'], required: true },
                    { model: models.Country, as: "country", attributes: ['id', 'code', 'country'], required: true },
                    { model: models.PostUpdated, as: "updateds", attributes: ['id', 'description'], required: false },
                    { model: models.PostDeleted, as: "deleteds", attributes: ['id', 'description'], required: false }
                ],
                order: [['updatedAt', 'desc']]
            });
            return res.status(200).json({
                code: 200,
                status: 'Success',
                items: posts
            });
        } catch (e) {
            return next(e);
        }
    });

    /**
     * POST UPDATEDS ROUTES
     * @POST
     * @DELETE
     */
    app.post('/post/updated-comment', async (req, res, next) => {
        const userId = getUserId(req.headers['authorization']);
        if (userId < 0)
            return res.status(401).json({
                code: 401,
                status: 'Unauthorized',
                message: 'Votre session a expirée ou vous n\'avez pas d\'autorisation pour accéder à cette ressource'
            });

        if (!req.body.postId || !req.body.description) {
            return next(new Error("Informations obligatoires manquantes"));
        }

        try {
            const newPostUpdated = await models.PostUpdated.create({
                postId: req.body.postId,
                description: req.body.description
            });
            return res.status(201).json({
                code: 201,
                status: 'Success',
                item: newPostUpdated
            });
        } catch (e) {
            return next(e);
        }
    });

    /**
     * POST DELETEDS ROUTES
     * @POST
     * @DELETE
     */
    app.post('/post/deleted-comment', async (req, res, next) => {
        const userId = getUserId(req.headers['authorization']);
        if (userId < 0)
            return res.status(401).json({
                code: 401,
                status: 'Unauthorized',
                message: 'Votre session a expirée ou vous n\'avez pas d\'autorisation pour accéder à cette ressource'
            });

        if (!req.body.postId || !req.body.description) {
            return next(new Error("Informations obligatoires manquantes"));
        }

        try {
            const newPostDeleted = await models.PostDeleted.create({
                postId: req.body.postId,
                description: req.body.description
            });
            return res.status(201).json({
                code: 201,
                status: 'Success',
                item: newPostDeleted
            });
        } catch (e) {
            return next(e);
        }
    });


    return app;
})();
