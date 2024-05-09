import mongoose from 'mongoose'

export function InitDbSetup(connectionString){
    mongoose.set('debug', true)
    mongoose.connect(connectionString).then(()=> {
        console.info("Data Base Connected..")
    }).catch(err =>{
        console.error(err)
    })
}