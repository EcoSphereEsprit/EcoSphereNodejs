import Produits from '../models/produits.model.js';
import Categorie from '../models/categories.model.js'; 
import upload from '../middlewares/multer-config.js';
import { validationResult } from 'express-validator'



export function addProduit(req, res) {
    const { name, description, prix, quantite_stock, categorie, brand, couleur, available } = req.body;

    const produitData = {
        name: name,
        description: description,
        prix: prix,
        quantite_stock: quantite_stock,
        categorie: categorie,
        image : `${req.protocol}://${req.get('host')}/img/${req.file.filename}`,
        brand: brand,
        couleur: couleur,
        available: available,
    };
    Produits.create(produitData)
        .then(async newProduit => {
            // Incrémenter le nombre de produits dans la catégorie associée
            await Categorie.findByIdAndUpdate(categorie, { $inc: { Nbr_produits: 1 } });
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
        
        await Categorie.findByIdAndUpdate(produit.categorie, { $inc: { Nbr_produits: -1 } });

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

        const { categorie: newCategorie } = req.body;
        const oldCategorie = produit.categorie;
        produit.name = req.body.name || produit.name;
        produit.description = req.body.description || produit.description;
        produit.prix = req.body.prix || produit.prix;
        produit.quantite_stock = req.body.quantite_stock || produit.quantite_stock;
        produit.categorie = req.body.categorie || produit.categorie;
        //produit.image = req.body.image || produit.image;
        produit.brand = req.body.brand || produit.brand;
        produit.couleur = req.body.couleur || produit.couleur;
        produit.available = req.body.available || produit.available;


        if (req.file) {
            produit.image = `${req.protocol}://${req.get('host')}/img/${req.file.filename}`;
        }

        
        await produit.save();


        // Vérifier si la catégorie updated
        if (newCategorie !== oldCategorie) {
            
            await Categorie.findByIdAndUpdate(oldCategorie, { $inc: { Nbr_produits: -1 } });
            
            await Categorie.findByIdAndUpdate(newCategorie, { $inc: { Nbr_produits: 1 } });
        }

        res.json({ message: 'Produit mis à jour avec succès', produit });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du produit', erreur: error.message });
    }
};

export const getProduitById = async (req, res) => {
    try {
        const produit = await Produits.findById(req.params.id);
        if (!produit) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.json(produit);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du produit', erreur: error.message });
    }
};

export const getProduitByName = async (req, res) => {
    try {
        const nameQuery = req.query.name;
        if (!nameQuery) {
            return res.status(400).json({ message: 'Le paramètre "name" est requis' });
        }

        const produits = await Produits.find({ name: new RegExp(nameQuery, 'i') });
        if (produits.length === 0) {
            return res.status(404).json({ message: 'Aucun produit trouvé' });
        }

        res.json(produits);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des produits', erreur: error.message });
    }
};

export const getProduitsByCategorieName = async (req, res) => {
    try {
        const { categorieName } = req.params;
        console.log(`Recherche de la catégorie par nom: ${categorieName}`);

        const categorie = await Categorie.findOne({ name: categorieName });
        if (!categorie) {
            console.log('Catégorie non trouvée');
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }

        console.log(`Catégorie trouvée: ${categorie._id}`);
        const produits = await Produits.find({ categorie: categorie._id });
        res.json(produits);
    } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error.message);
        res.status(500).json({ message: 'Erreur lors de la récupération des produits', erreur: error.message });
    }
};

export const getProduitsByPriceRange = async (req, res) => {
    try {
        const { min, max } = req.query;

        if (!min || !max) {
            return res.status(400).json({ message: 'Veuillez fournir les paramètres de prix min et max.' });
        }

        const produits = await Produits.find({
            prix: {
                $gte: Number(min),
                $lte: Number(max)
            }
        });

        res.json(produits);
    } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error.message);
        res.status(500).json({ message: 'Erreur lors de la récupération des produits', erreur: error.message });
    }
};

export const getProduitsSortedByDate = async (req, res) => {
    try {
        const { order } = req.query;
        let sortOrder = 1; // tri asce

        
        if (order && order.toLowerCase() === 'desc') {
            sortOrder = -1; // Tri desc
        }

        
        const produits = await Produits.find().sort({ createdAt: sortOrder });

        res.json(produits);
    } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error.message);
        res.status(500).json({ message: 'Erreur lors de la récupération des produits', erreur: error.message });
    }
};

export const checkStockAvailability = async (req, res) => {
    try {
        const { productId } = req.params;

       
        const produit = await Produits.findById(productId);

        if (!produit) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        
        const isAvailable = produit.quantite_stock > 0;

        res.json({ isAvailable });
    } catch (error) {
        console.error('Erreur lors de la vérification de la disponibilité du stock:', error.message);
        res.status(500).json({ message: 'Erreur lors de la vérification de la disponibilité du stock', erreur: error.message });
    }
};

