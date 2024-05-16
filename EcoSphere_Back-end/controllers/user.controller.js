import User from '../models/user.model.js'
import { validationResult } from 'express-validator'




export function addone(req,res){
    if(!validationResult(req).isEmpty()){
        res.status(400).json({errors : validationResult(req).array()})
    }
    else{
        console.log(req.file)
        User.create({
            username : req.body.username,
            email : req.body.email,
            password : req.body.password,
            phoneNumber : req.body.phoneNumber,
            image : `${req.protocol}://${req.get('host')}/img/${req.file.filename}`
        }

        )
        .then(newUser => {
            res.status(201).json(newUser)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }
}

export function findAll(req,res){
   User.find({} ,'_id username phoneNumber')
   .then(result => {
        res.status(200).json(result)
   })
   .catch(err =>{
    res.status(500).json(err)
   })
}

export function getOneByUserName (req, res){
    User.findOne({username : req.params.username})
    .then(user => {
        res.status(200).json(user)
    })
    .catch(err => {
        res.status(500).json(err)
    })
}
