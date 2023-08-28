'use strict'
const jwt = require('jsonwebtoken');

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // jwt.sign(payload, privatekey, algorithm)
        const accessToken = jwt.sign(payload, (privateKey.toString()), {
            expiresIn: '2 days'
        })

        const refreshToken = jwt.sign(payload, (privateKey.toString()), {
            expiresIn: '7 days'
        })

        jwt.verify(accessToken, publicKey, (err, decoded) => {
            if (err) {
                console.log('verify error: ' + err);
            }
            console.log('decode verify: ' + decoded)
        })
        return { accessToken, refreshToken }
    } catch (err) {
        console.log(err)
    }
}

module.exports = createTokenPair