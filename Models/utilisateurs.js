 // grab the things we need
 const { Double } = require('mongodb');
var mongoose = require('mongoose');
 var Schema = mongoose.Schema;
 
 // create a schema
 var utilisateurSchema = new Schema({
     nom: String,
     prenom: String,
     email: String,
     password: String,
     adresseLigne1: String,
     adresseLigne2: String,   
     adresseLigne3: String,
     ville: String,
     CP: String,
     dateinscription: Date,
     datenaissance: Date,
     telephonefixe: String,
     telephoneport: String,
     biens: [
        {
            id: Number,
            adresseLigne1: String,
            adresseLigne2: String,   
            adresseLigne3: String,
            ville: String,
            CP: String,
            surface: Double,
            nbpiece: Number,
            type: String,
        }
     ]} )
 
 // the schema is useless so far
 // we need to create a model using it
 var utilisateurs = mongoose.model('GestionLocation', utilisateurSchema, 'Data');
 
 // make this available to our users in our Node applications
 module.exports = utilisateurs;
 