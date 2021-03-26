import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import dotenv from 'dotenv'
import moment from 'moment-timezone'
import session from 'express-session'
import bodyParser from 'body-parser'
import redis from 'redis'
import pug from 'pug'
import multer from 'multer'
import flash from 'express-flash'

import routers from './routes'

import { timezone } from './config/constant'
import winston from './config/logFile'
dotenv.config({path: `${__dirname}/../.env`})
let RedisStore = require('connect-redis')(session)
const host = process.env.DEV_CACHE_HOST || 'localhost'
const port = process.env.DEV_CACHE_PORT || '6379'

const redisClient = redis.createClient(port, host)
moment.tz.setDefault(timezone)
moment.locale('vi')

const app = express()
app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  // res.set({'maxAge':30000});
  next();
});

// express-session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    maxAge:30 * 86400 * 1000,
    expires: new Date(Date.now() + (30 * 86400 * 1000))
  },
  store: new RedisStore({ client: redisClient })
}))
//Session- luu data 1 lan
app.use(flash());

app.use(logger('combined', { stream: winston.stream }))
app.use(express.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser())

app.set('views', './src/views')
app.set('view engine', 'pug')
app.use(express.static('public'))
app.use('/', routers)

app.use(async (req, res, next) => {
  res.locals.domainRoot = process.env.DOMAIN_ROOT
  res.locals.domainImg = process.env.DOMAIN_IMG
  next()
})


app.use(function(req, res, next){
  res.status(404)
  res.send({code: 404})
})

export default app