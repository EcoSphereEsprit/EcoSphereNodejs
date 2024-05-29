import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { InitDbSetup } from './config/DataBaseSetUp.js';
import userRoutes from './routes/user.route.js';
import imgRoutes from './routes/img.route.js';
import commandeRoutes from './routes/commande.route.js';
import facturationRoutes from './routes/facturation.route.js';
import paiementRoutes from './routes/paiement.route.js';
import paiementModel from './models/paiement.model.js';
import FacturationModel from './models/Facturation.model.js';
import commandeModel from './models/commande.model.js';
import { notFoundError, errorHandler } from './middlewares/errorhandler.js';
import * as path from 'path'; // Import path module for handling file paths

// Config env vars are fetched from this config file
import configObject from './config/app.config.json'; // Directly import the JSON file

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
// Only use in dev environment
app.use(morgan('dev'));

// Routes setup
app.use('/commandes', commandeRoutes);
app.use('/facturation', facturationRoutes);
app.use('/paiement', paiementRoutes);
app.use('/user', userRoutes);
app.use('/img', imgRoutes);

// Serve static images
app.use('/img', express.static(path.join(__dirname, 'public', 'images')));

// Error handling middleware
app.use(notFoundError);
app.use(errorHandler);

// Database connection setup
InitDbSetup(configObject.database.url);

app.listen(configObject.server.port, () => {
    console.info("Server listening on port " + configObject.server.port);
});
