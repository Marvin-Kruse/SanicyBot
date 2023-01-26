const express = require('express')
const ownerapi = require('./owner/index')
const error_404 = require('./error/404')
module.exports = (client) => {
    const app = express()
    ownerapi(client, app)
    error_404(client, app)
    app.listen()
}