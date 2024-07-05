import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import morgan from 'morgan'
import cors from 'cors'
import { InitDbSetup } from './config/DataBaseSetUp.js'
import userRoutes from './routes/user.route.js'
import commentRoutes from './routes/comment.route.js'
import blogRoutes from './routes/blog.route.js'
import imgRoutes from './routes/img.route.js'
import { notFoundError, errorHandler, authenticateToken } from './middlewares/errorhandler.js'
import * as fs from 'fs';
import couponRoutes from './routes/coupon.route.js'
// produit
import productRouter from './routes/produits.route.js'
import categorieRouter from './routes/categories.route.js'

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

//app.use(authenticateToken);
app.use('/user', userRoutes)

//merge
//produit routes
app.use('/produit', productRouter);
//app.use('/Getproduits', productRouter);
//categories routes
app.use('/categories', categorieRouter);

app.use('/commandes', commandeRoutes);
app.use('/facturation', facturationRoutes);

app.use('/img', imgRoutes)
app.use('/blogs', blogRoutes)
app.use('/comments', commentRoutes)
app.use('/coupon', couponRoutes)
app.use('/user', userRoutes)
app.use(notFoundError)
app.use(errorHandler)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/img', express.static('./public/images'));
app.use('/paiement', paiementRoutes);
app.use('/user', userRoutes);
app.use('/img', imgRoutes);



//db conig call
InitDbSetup(configObject.database.url);


app.listen(configObject.server.port, () => {
  console.info("server listning on " + configObject.server.port)
})