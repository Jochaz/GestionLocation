const express = require('express');
const app = express();
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt")
var utilisateurs = require('./Models/utilisateurs.js');



dotenv.config();
mongoose.set("strictQuery", false);
mongoose.connect(process.env.URIDEV, { useNewUrlParser: true, useUnifiedTopology: true });

// create application/json parser
var jsonParser = bodyParser.json()

//function pour voir si on peut faire des requetes
function validRequest(req) {
  return (req.headers["authorization"] === process.env.TOKENAUTHORIZATION)
}

//POST LOGIN
app.post('/login', jsonParser , function (req, res)  {
  try {
    const { email, password } = req.body;
    if (!validRequest(req)) return res.status(403).send("Erreur d'authentification pour utiliser l'API.");

    utilisateurs.findOne(({email: email.toLowerCase()}), function(err, document) {
      if (err) res.status(401).send("Erreur dans l'authentification de l'utilisateur.")
      if (document) { 
        bcrypt.compare(password, document.password, function(err, result) {
          if (result){
            res.status(200).send(document) 
          } else {
            res.status(401).send("Le mot de passe saisie est incorrect.");
          }
        })
        
      } else
      { res.status(401).send("L''adresse email saisie est introuvable."); }
    })
  } catch (error) {
    return res.status(500).send(error);
  }
});

//GET USERS?ID=x
app.get('/users', jsonParser, function(req, res) {
  try {
    const {id} = req.query;
    if (!validRequest(req)) return res.status(403).send("Erreur d'authentification pour utiliser l'API.");

    utilisateurs.findById(id, function (err, document) {
      if (err) return res.status(404).send("Aucun utilisateur n'a été trouvé.");
      return res.status(200).send(document);
    });
  } catch (error) {
    return res.status(500).send(error);
  }
});

//POST REGISTER 
app.post('/register', jsonParser, function(req, res) {
  try {
    const {email, password, passwordconfirm, nom, prenom} = req.body;
    const regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    
    if (!validRequest(req)) return res.status(403).send("Erreur d'authentification pour utiliser l'API.");

    if (!(password === passwordconfirm)) return res.status(400).send("Vous devez saisir deux fois le même mot de passe.");

    if (!email) return res.status(400).send("Vous devez saisir votre adresse email.");
    if (!password) return res.status(400).send("Vous devez saisir votre mot de passe.");
    if (!nom) return res.status(400).send("Vous devez saisir votre nom.");
    if (!prenom) return res.status(400).send("Vous devez saisir votre prénom.");

    if (!regularExpression.test(password)) return res.status(400).send("Votre mot de passe doit contenir au moins 8 caractères, un caratère minuscule, un caractère majuscule et un caractère spécial (!@#$%^&*).");
    
    utilisateurs.findOne(({email: email.toLowerCase()}), function(err, document) {
      if (document) return res.status(400).send("Cette adresse email est déjà utilisée.");

      bcrypt.genSalt(10, (err, salt) => {
        if (err) return res.status(500).send(err);
        bcrypt.hash(password, salt, function(err, hash) {
          if (err) return res.status(500).send(err);
          utilisateurs.create({nom: nom.toUpperCase(), 
                               prenom: prenom.charAt(0).toUpperCase() + prenom.slice(1).toLowerCase(), 
                               email: email, 
                               password: hash,
                               adresseLigne1: '',
                               adresseLigne2: '',
                               adresseLigne3: '',
                               CP: '',
                               Ville: '',
                               dateinscription: Date.now(),
                               telephonefixe:'',
                               telephoneport: '',
                               biens: []}).then(
                                res.status(201).send("Votre compte a bien été créé.")
                               );

        });
      })
    });
  } catch (error) {
    return res.status(500).send(error);
  }
})


app.listen(3000, () => {
  console.log('Serveur API Gestion location démarrer sur http://localhost:3000');
});