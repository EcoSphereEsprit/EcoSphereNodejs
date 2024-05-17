import Produit from '../models/produits.model.js'

import { validationResult } from 'express-validator'

export function addProduit(req, res) {
    if (!validationResult(req).isEmpty()) {
        console.log('xxxxxxxxxxxxx')
        res.status(400).json({ errors: validationResult(req).array() });
    } else {
        console.log('hhhhhhhh')
        const { name, description, prix, quantite_stock, categorie, brand, couleur, available } = req.body;
        
        const produitData = {
            name: name,
            description: description,
            prix: prix,
            quantite_stock: quantite_stock,
            categorie: categorie,
            brand: brand,
            couleur: couleur,
            available: available,
            // image: `${req.protocol}://${req.get('host')}/img/${req.file.filename}`
        };

        Produit.create(produitData)
            .then(newProduit => {
                res.status(201).json(newProduit);
            })
            .catch(err => {
                res.status(500).json(err);
            });


         
    
    }
}