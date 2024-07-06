import { validationResult } from 'express-validator';
import Categorie from '../models/categories.model.js';

export const addCategorie = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } else {
        const { name, Nbr_produits } = req.body;
        const categorieData = {
            name: name,
            Nbr_produits: Nbr_produits
        };

        Categorie.create(categorieData)
            .then(newCategorie => {
                res.status(201).json(newCategorie);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json(err);
            });
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Categorie.find();
        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const deleteCategorie = async (req, res) => {
    try {
        const categorie = await Categorie.findByIdAndDelete(req.params.id);
        if (!categorie) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }
        res.json({ message: 'Catégorie supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la catégorie', erreur: error.message });
    }
};

export const updateCategorie = async (req, res) => {
    try {
        const categorie = await Categorie.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!categorie) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }
        res.json({ message: 'Catégorie mise à jour avec succès', categorie });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la catégorie', erreur: error.message });
    }
};

export function getCategorieById(req, res) {
    User.findOne({ _id: req.params.id })
        .then(category => {
            res.status(200).json(category)
        })
        .catch(err => {
            res.status(500).json(err)
        })
}


