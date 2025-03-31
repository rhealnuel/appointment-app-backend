const express = require('express')
const mongoose = require('mongoose')
require("dotenv").config()
const users = require("./routes/users")
const appointments = require('./routes/appointment')

const app = express()
app.use(express.json()); // For JSON payloads
app.use(express.urlencoded({ extended: true }))

const MONGO_URL = process.env.MONGO_URL

app.use('/api', users )
app.use('/api', appointments )


mongoose.
connect(MONGO_URL)
.then(() =>{
    console.log('connected to mongodb')

    app.listen(3000, () => {
        console.log("app running at port 3000")
    })
}).catch((error) =>{
    console.log(error)
})
