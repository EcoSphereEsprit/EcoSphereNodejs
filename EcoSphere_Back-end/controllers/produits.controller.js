import Produits from '../models/produits.model.js'

import { validationResult } from 'express-validator'

/*export function addProduit(req, res) {
    if (!validationResult(req).isEmpty()) {
       
         res.status(400).json({ errors: validationResult(req).array() });
     } else {
       
        const { name, description, prix, quantite_stock, categorie, image, brand, couleur, available } = req.body;
        console.log(`this is the data of the product`, produitData);
        const produitData = {
            name: name,
            description: description,
            prix: prix,
            quantite_stock: quantite_stock,
            categorie: categorie,
            brand: brand,
            couleur: couleur,
            available: available,
            image: image
            // image: `${req.protocol}://${req.get('host')}/img/${req.file.filename}`
            
        };

        Produits.create(produitData)
            .then(newProduit => {
                res.status(201).json(newProduit);
                console.log(`xxxxxxxx`, newProduit);
            })
            .catch(err => {
                console.log(`produittttt`, err);
                res.status(500).json(err);
            });


         
    
     }

}*/

export function addProduit(req, res) {
    const { name, description, prix, quantite_stock, categorie, image, brand, couleur, available } = req.body;

    const produitData = {
        name: name,
        description: description,
        prix: prix,
        quantite_stock: quantite_stock,
        categorie: categorie,
        brand: brand,
        couleur: couleur,
        available: available,
    };

    // Only include image field if it's provided in the request body :okayy thank <3
    if (image) {
        produitData.image = image;
    }

    Produits.create(produitData)
        .then(newProduit => {
            res.status(201).json(newProduit);
            console.log(`New Product Created:`, newProduit);
        })
        .catch(err => {
            console.error(`Error Creating Product:`, err);
            res.status(500).json(err);
        });
}

export function getProduits(req, res) {
    Produits.find()
        .then(produits => {
            if (!produits) {
                return res.status(404).json({ message: "No products found." });
            }
            res.status(200).json(produits);
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
}
export const deleteProduit = async (req, res) => {
    try {
        const produit = await Produits.findByIdAndDelete(req.params.id);
        if (!produit) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.json({ message: 'Produit supprimé avec succès' });
    } catch (erreur) {
        res.status(500).json({ message: 'Erreur lors de la suppression du produit', erreur });
    }
};

export const updateProduit = async (req, res) => {
    try {
        const produit = await Produits.findById(req.params.id);
        if (!produit) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        
        produit.name = req.body.name || produit.name;
        produit.description = req.body.description || produit.description;
        produit.prix = req.body.prix || produit.prix;
        produit.quantite_stock = req.body.quantite_stock || produit.quantite_stock;
        produit.categorie = req.body.categorie || produit.categorie;
        //produit.image = req.body.image || produit.image;
        produit.brand = req.body.brand || produit.brand;
        produit.couleur = req.body.couleur || produit.couleur;
        produit.available = req.body.available || produit.available;

        await produit.save();

        res.json({ message: 'Produit mis à jour avec succès', produit });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du produit', erreur: error.message });
    }
};

