const express = require('express')
const path = require('path')
const api  = require('./api/routes')

let app = express()

app.use(express.static(path.join(__dirname, 'public')))
// app.use(express.static(path.join(__dirname, 'client_app')))

app.use('/api', api)
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

let port = process.env.PORT || 3000
app.listen(port, () => console.log('starting server'))