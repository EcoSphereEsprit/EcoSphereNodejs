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
            dateCreation: req.body.dateCreation,
            dateExpiration: req.body.dateExpiration,
            status: req.body.status,

        }).then(newCoupon => {
            console.log(newCoupon);
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
        // const coupon = await Coupon.findByIdAndUpdate({ code: req.params.code }, req.body, { new: true, runValidators: true });
        const coupon = await Coupon.findOne({ code: req.params.code });

        if (!coupon) {
            return res.status(404).json({ message: 'Coupon non trouvée' });
        }
        // res.status(200).send(coupon);
        Object.assign(coupon, req.body);
        // await ajouterHistoriqueStatut(coupon, req.body);
        res.status(200).json(await coupon.save());
    } catch (error) {
        res.status(400).json(error);
    }
}

export const deleteOneByCode = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete({ _id: req.params.id });
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

