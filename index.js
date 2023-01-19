const express = require('express');
const app = express();
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
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
  const { email, password } = req.body;
  if (!validRequest(req)) {
    return res.status(403).send("Erreur d'authentification pour utiliser l'API");
  }

  utilisateurs.findOne(({email: email.toLowerCase(), password: password}), function(err, document) {
    if (err) res.status(401).send("Erreur dans l'authentification de l'utilisateur.")

    if (document) { res.status(200).send(document) } else
    { res.status(401).send('La combinaison "Adresse email" et "mot de passe" est incorrect.'); }
  })
});

app.listen(3000, () => {
  console.log('Serveur API Gestion location démarrer sur http://localhost:3000');
});