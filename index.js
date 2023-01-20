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

app.post('/login', jsonParser , function (req, res)  {
  try {
    const { email, password } = req.body;

    if (!validRequest(req)) {
      return res.status(403).send("Erreur d'authentification pour utiliser l'API");
    }

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

app.get('/users', jsonParser, function(req, res) {
  try {
    const {id} = req.query;
    if (!validRequest(req)) {
      return res.status(403).send("Erreur d'authentification pour utiliser l'API");
    }

    utilisateurs.findById(id, function (err, document) {
      if (err) return res.status(404).send("Aucun utilisateur n'a été trouvé.");
      return res.status(200).send(document);
    });
  } catch (error) {
    return res.status(500).send(error);
  }
});



app.listen(3000, () => {
  console.log('Serveur API Gestion location démarrer sur http://localhost:3000');
});