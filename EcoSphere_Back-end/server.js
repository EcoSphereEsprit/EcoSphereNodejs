import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { InitDbSetup } from './config/DataBaseSetUp.js'
import userRoutes from './routes/user.route.js'
import imgRoutes from './routes/img.route.js'
import { notFoundError, errorHandler } from './middlewares/errorhandler.js'
import * as fs from 'fs';
import commandeRoutes from './routes/commande.route.js';
import facturationRoutes from './routes/facturation.route.js';
import paiementRoutes from './routes/paiement.route.js';
import paiementModel from './models/paiement.model.js';
import FacturationModel from './models/Facturation.model.js';
import commandeModel from './models/commande.model.js';


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
app.use(notFoundError)
app.use(errorHandler)
app.use('/img', express.static('.\public\images'));
app.use('/commandes', commandeRoutes);
app.use('/facturation', facturationRoutes);
app.use('/paiement', paiementRoutes);
app.use('/user', userRoutes);
app.use('/img', imgRoutes);

//db conig call
InitDbSetup(configObject.database.url);

app.listen(configObject.server.port, () => {
    console.info("server listning on " + configObject.server.port)
})













