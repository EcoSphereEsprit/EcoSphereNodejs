import Produit from '../models/produits.model.js'
import { validationResult } from 'express-validator'

export function addOneProduct(req, res) {
    if (!validationResult(req).isEmpty()) {
        res.status(400).json({ errors: validationResult(req).array() });
    } else {
        const { name, description, prix, quantite_stock, categorie, userId } = req.body;
        
        const produitData = {
            name: name,
            description: description,
            prix: prix,
            quantite_stock: quantite_stock,
            categorie: categorie,
            //update all attributes
            image: `${req.protocol}://${req.get('host')}/img/${req.file.filename}`
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