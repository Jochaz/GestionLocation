
 // grab the things we need
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
     telephonefixe: String,
     telephoneport: String} )
 
 // the schema is useless so far
 // we need to create a model using it
 var utilisateurs = mongoose.model('GestionLocation', utilisateurSchema, 'Data');
 
 // make this available to our users in our Node applications
 module.exports = utilisateurs;
 