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


