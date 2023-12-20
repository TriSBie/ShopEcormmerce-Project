const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3500
    },
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || 27100,
        name: process.env.DEV_DB_NAME || 'shopDEV'
    }
}

const pro = {
    app: {
        port: process.env.DEV_APP_PORT || 3512
    },
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || 27100,
        name: process.env.DEV_DB_NAME || 'shopPRO'
    }
}

const config = { dev, pro }
const env = process.env.NODE_ENV || 'dev'

module.exports = config[env]