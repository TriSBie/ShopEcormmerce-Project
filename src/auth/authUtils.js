'use strict'
const jwt = require('jsonwebtoken');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const KeyTokenService = require('../services/keytoken.services');
const { asyncHandler } = require('../helpers/asyncHandler');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESH_TOKEN: 'refresh-token',
}
/**
 * 
 * @param {*} payload : data to encrypted
 * @param {*} publicKey : short-term key for accessKey creation
 * @param {*} privateKey : long-term key for refreshKey creation
 * @returns 
 */
const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // jwt.sign(payload, privatekey, algorithm)
        console.log({ payload })
        const accessToken = jwt.sign(payload, publicKey, {
            expiresIn: '2 days'
        })

        const refreshToken = jwt.sign(payload, privateKey, {
            expiresIn: '7 days'
        })
        return { accessToken, refreshToken }

    } catch (err) {
        console.log(err)
    }
}

/**
* 1. Check userId is missing ?
* 2. get AccessToken
* 3. verify token
* 4. check user in bds
* 5. check keyStore with this userId
* 6. Overall checked pass ? => move next middleware
* => BUG! In some cases, user's accessToken has expired => get refreshToken instead !
*/
const authentication = asyncHandler(async (req, res, next) => {
    // 1. Check userId is missing ?
    const userId = req.headers?.[HEADER['CLIENT_ID']]; //get uerid logged in
    console.log({ userId });
    if (!userId) {
        throw new AuthFailureError('Unanthenticated').getNotice();
    }

    // 2. get KeyServices [publicKey, privateKey, refreshTokenUsed, refreshToken]
    const keyStore = await KeyTokenService.findById(userId); //get refreshKey, publicKey & privateKey of that user already logged in
    console.log({ keyStore });

    if (!keyStore) {
        throw new NotFoundError('Invalid token').getNotice();
    }

    // 3. verify token
    const accessToken = req.headers?.[HEADER['AUTHORIZATION']];
    console.log({ accessToken });
    if (!accessToken) {
        throw new AuthFailureError('Invalid request').getNotice();
    }
    try {
        //jwt verify (checkedToken, secretOrPublicKey, (err, decoded))
        const decodedUser = jwt.verify(accessToken, keyStore?.publicKey);
        if (userId !== decodedUser?.userId) {
            throw new AuthFailureError('Invalid userId').getNotice()
        }
        req.keyStore = keyStore;
        req.user = decodedUser;

        return next();
    } catch (err) {
        throw err
    }
})

/**
* 1. Check userId is missing ?
* 2. get RefreshToken
* 3. verify token
* 4. check user in bds
* 5. check keyStore with this userId
* 6. Overall checked pass ? => move next middleware
* => BUG! In some cases, user's accessToken has expired => get refreshToken instead !
*/
const authenticationV2 = asyncHandler(async (req, res, next) => {
    // 1. Check userId is missing ?
    const userId = req.headers?.[HEADER['CLIENT_ID']]; //get uerid logged in
    console.log({ userId });
    if (!userId) {
        throw new AuthFailureError('Unanthenticated').getNotice();
    }

    // 2. get KeyServices [publicKey, privateKey, refreshTokenUsed, refreshToken]
    const keyStore = await KeyTokenService.findById(userId);
    console.log({ keyStore });

    if (!keyStore) {
        throw new NotFoundError('Invalid token').getNotice();
    }
    // 2.1 get RefreshToken from headers
    if (req.headers?.[HEADER['REFRESH_TOKEN']]) {
        try {
            //  jwt verify (checkedToken, secretOrPublicKey, (err, decoded))
            const refreshToken = req.headers?.[HEADER['REFRESH_TOKEN']]
            console.log({ refreshToken });
            const decodedUser = jwt.verify(refreshToken, keyStore?.privateKey);
            console.log({ decodedUser });
            if (userId !== decodedUser?.userId) {
                throw new AuthFailureError('Invalid userId').getNotice()
            }

            req.keyStore = keyStore;
            req.user = decodedUser;
            req.refreshToken = refreshToken;
            return next();
        } catch (err) {
            throw err
        }
    }

    // 3. verify token
    const accessToken = req.headers?.[HEADER['AUTHORIZATION']];
    console.log({ accessToken });

    if (!accessToken) {
        throw new AuthFailureError('Invalid request').getNotice();
    }
    try {
        //  jwt verify (checkedToken, secretOrPublicKey, (err, decoded))
        const decodedUser = jwt.verify(accessToken, keyStore?.publicKey);

        if (userId !== decodedUser?.userId) {
            throw new AuthFailureError('Invalid userId').getNotice()
        }
        req.keyStore = keyStore;
        req.user = decodedUser;

        return next();
    } catch (err) {
        throw err
    }
})

//  token : payload data stored
//  keySecret : publicKey, privateKey or SHA algorithms
const verifyJWT = async (token, keySecret) => {
    return jwt.verify(token, keySecret)
}

//using closure function that references variables from outside its body
const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: "Permission Denied"
            })
        }
        const validPermission = req.objKey.permissions.includes(permission);
        if (!validPermission) {
            return res.status(403).json({
                message: "Permission Denied"
            })
        }
        return next();
    }
}

module.exports = { createTokenPair, authentication, verifyJWT, permission, authenticationV2 }