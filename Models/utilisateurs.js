 // grab the things we need
 const { Double } = require('mongodb');
 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;

 var bienSchema = new Schema({
    address1: String,
    address2: String,   
    address3: String,
    ville: String,
    cp: String,
    surfacetotale: String,
    surfacehabitation: String,
    etage: String,
    residence: String,
    nbpiece: String,
    nbsdb: String,
    nbchambre: String,
    classeenergie: String,
    ges: String,
    loyermensuel: String,
    prixachat: String,
    type: String,
    dateacquisition: String
 })
 
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
     biens: [bienSchema]
 })


 
 // the schema is useless so far
 // we need to create a model using it
 var utilisateurs = mongoose.model('GestionLocation', utilisateurSchema, 'Data');
 
 // make this available to our users in our Node applications
 module.exports = utilisateurs;
 