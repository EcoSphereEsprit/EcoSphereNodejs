import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { InitDbSetup } from './config/DataBaseSetUp.js'
import userRoutes from './routes/user.route.js'
import imgRoutes from './routes/img.route.js'
import { notFoundError, errorHandler } from './middlewares/errorhandler.js'
import * as fs from 'fs';
import couponRoutes from './routes/coupon.route.js'



//Config env vars are fetched from this config file
const configFile = fs.readFileSync('./config/app.config.json', 'utf8');
const configObject = JSON.parse(configFile);
const app = express()
//mdws set up
app.use(cors())
app.use(express.json())
//Only use in dev envirement
app.use(morgan('dev'))
app.use('/user', userRoutes)
app.use('/img', imgRoutes)
app.use('/coupon', couponRoutes)
app.use(notFoundError)
app.use(errorHandler)
app.use('/img', express.static('.\public\images'));

//db conig call
InitDbSetup(configObject.database.url);

app.listen(configObject.server.port, () => {
    console.info("server listning on " + configObject.server.port)
})