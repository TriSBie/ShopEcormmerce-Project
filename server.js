const app = require("./src/app");
const dotenv = require('dotenv').config()


const PORT = process.env.PORT || 3500

const server = app.listen(PORT, () => {
    console.log(`Server is start at PORT: ${PORT}`)
})

process.on('SIGINT', () => {
    server.close(() => console.log('Exit Server Express'))
    // app.notify('Ping...')
})



