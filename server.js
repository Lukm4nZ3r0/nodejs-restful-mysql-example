const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const routes = require('./routes.js')
const cors = require('cors')
require('dotenv').config()
const PORT = process.env.PORT || 4000

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

var whitelist = ['http://192.168.100.51', 'http://192.168.100.22','http://localhost','http://192.168.6.109','http://192.168.6.118']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials:true
}

app.use(cors())
// app.use((req,res,next)=>{
//     res.header('Access-Control-Allow-Origin','*')
//     res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE')
//     res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept')
//     next()
// })

routes(app, corsOptions)

app.listen(PORT, ()=>{
    console.log('Server listen on port : ' + PORT)
})