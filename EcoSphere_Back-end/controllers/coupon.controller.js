import Coupon from '../models/coupon.model.js'
import { validationResult } from 'express-validator'



export function addone(req, res) {
    if (!validationResult(req).isEmpty()) {
        res.status(400).json({ errors: validationResult(req).array() })
    }
    else {
        Coupon.create({
            code: req.body.code,
            reduction: req.body.reduction,
            dateExpiration: req.body.dateExpiration,
        }

        )
            .then(newCoupon => {
                res.status(201).json(newCoupon)
            })
            .catch(err => {
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
