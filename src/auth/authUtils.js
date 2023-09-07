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
        jwt.verify(accessToken, privateKey, (err, decoded) => {
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
})

module.exports = createTokenPair