//config env
require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser') // server nodejs k cos
const logger = require('morgan')
const mongoClient = require('mongoose')

//setup connect mongodb by mongoose
mongoClient.connect('mongodb://localhost/nodejsapistarter', {
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(() => {
        console.log('connect success 😍')
    })
    .catch((err) => {
        console.error(`connect failed 🥺with error: ${err}`)
    })

//route
const userRoute = require('./routes/user')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

//Middlewares: chay trc khi den request
app.use(logger('dev')) //show ra thông tin 1 request (dev is best)



//routes
app.use('/users', userRoute)



//Catch (first 404)
app.use((req, res, next) => {
    const err = new Error('not found');
    err.status = 404
    next(err) // chuyen den error handler function
})

//Error handler function
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {}
    const status = err.status || 500

    //response to client
    return res.status(status).json({
        error: {
            message: error.message
        }
    })
})

//start server
const port = app.get('port') || 3000
app.listen(port, () => {
    console.log(`server is listening on port: ${port}`)
})