import Coupon from '../models/coupon.model.js'
import { validationResult } from 'express-validator'



export function postCoupon(req, res) {
    console.log('rrr');
    if (!validationResult(req).isEmpty()) {
        console.log('rrr');
        res.status(400).json({ errors: validationResult(req).array() })
    } else {
        console.log('rrr');
        Coupon.create({
            code: req.body.code,
            reduction: req.body.reduction,
            dateExpiration: req.body.dateExpiration,
        }).then(newCoupon => {
            res.status(201).json(newCoupon)
        }).catch(err => {
            res.status(500).json(err)
        })
    }
}

export function findAll(req, res) {
    Coupon.find({}, '_id code reduction')
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json(err)
        })
}

export function getOneByCode(req, res) {
    Coupon.findOne({ code: req.params.code })
        .then(coupon => {
            res.status(200).json(coupon)
        })
        .catch(err => {
            res.status(500).json(err)
        })
}

export const updateOneByCode = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon non trouvée' });
        }
        res.status(200).send(coupon);
    } catch (error) {
        res.status(400).send(error);
    }
}

export const deleteOneByCode = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon non trouvée' });
        }
        res.json({ message: 'Coupon supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la coupon', erreur: error.message });
    }
}

export function affectCouponToUser(req, res) {

}

export function affectCouponToProduct(req, res) {

}

