'use strict'
const jwt = require('jsonwebtoken');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const KeyTokenService = require('../services/keytoken.services');
const { asyncHandler } = require('../helpers/asyncHandler');
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // jwt.sign(payload, privatekey, algorithm)
        console.log({ payload })
        const accessToken = jwt.sign(payload, publicKey, { //sign jwt ưith algorithm publicKey
            expiresIn: '2 days'
        })

        const refreshToken = jwt.sign(payload, privateKey, {
            expiresIn: '7 days'
        })

        jwt.verify(accessToken, publicKey, (err, decoded) => {
            if (err) {
                console.log('verify error: ' + err);
            }
            console.log('decode verify: ' + { decoded })
        })
        return { accessToken, refreshToken }

    } catch (err) {
        console.log(err)
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    /**
* 1. Check userId missing ?
* 2. get AccessToken
* 3. verify token
* 4. check user in bds
* 5. check keyStore with this userId
* 6. Ok all ? => move next middleware
* */
    // 1 
    const userId = req.headers?.[HEADER['CLIENT_ID']]; //get uerid logged in
    console.log({ userId })
    if (!userId) {
        throw new AuthFailureError('Unanthenticated').getNotice();
    }

    // 2
    const keyStore = await KeyTokenService.findById(userId); //get refreshKey, publicKey & privateKey of that user already logged in
    console.log({ keyStore })
    if (!keyStore) {
        throw new NotFoundError('Invalid token').getNotice();
    }

    // 3
    const accessToken = req.headers?.[HEADER['AUTHORIZATION']];
    console.log({ accessToken })
    if (!accessToken) {
        throw new AuthFailureError('Invalid request').getNotice();
    }

    try {
        //jwt verify (checkedToken, secretOrPublicKey, (err, decoded))
        const decodedUser = jwt.verify(accessToken, keyStore?.publicKey);
        console.log({ decodedUser })
        if (userId !== decodedUser?.userId) throw new AuthFailureError('Invalid userId').getNotice()
        req.keyStore = keyStore;
        return next();
    } catch (err) {
        throw err
    }
})


const verifyJWT = async (token, keySecret) => {
    return await jwt.verify(token, keySecret)
}

module.exports = { createTokenPair, authentication, verifyJWT }