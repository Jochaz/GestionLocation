const express = require('express');
const app = express();
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt")
var utilisateurs = require('./Models/utilisateurs.js');
var cors = require('cors');

app.use(cors());

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
    if (!validRequest(req)) return res.status(403).send({"erreur":"Erreur d'authentification pour utiliser l'API."});

    utilisateurs.findOne(({email: email.toLowerCase()}), function(err, document) {
      if (err) res.status(401).send({"erreur":"Erreur dans l'authentification de l'utilisateur."})
      if (document) { 
        bcrypt.compare(password, document.password, function(err, result) {
          if (result){
            res.status(200).send({"token":document._id, "user": document}) 
          } else {
            res.status(401).send({"erreur":"Le mot de passe saisie est incorrect."});
          }
        })
        
      } else
      { res.status(401).send({"erreur":"L''adresse email saisie est introuvable."}); }
    })
  } catch (error) {
    return res.status(500).send({"erreur":error});
  }
});

//GET USERS?ID=x
app.get('/users', jsonParser, function(req, res) {
  try {
    const {id} = req.query;
    if (!validRequest(req)) return res.status(403).send({"erreur":"Erreur d'authentification pour utiliser l'API."});

    utilisateurs.findById(id, function (err, document) {
      if (err) return res.status(404).send({"erreur":"Aucun utilisateur n'a été trouvé."});
      return res.status(200).send({"doc": document});
    });
  } catch (error) {
    return res.status(500).send(error);
  }
});

//PUT USER (modif compte)
app.put('/users', jsonParser , function (req, res)  {
  try {
    const { _id, telephoneport, telephonefixe, adresseLigne1, adresseLigne2, adresseLigne3, CP, ville } = req.body;
    if (!validRequest(req)) return res.status(403).send({"erreur":"Erreur d'authentification pour utiliser l'API."});
    console.log(req.body)
    utilisateurs.findById(_id, function(err, document) {
      if (err) res.status(401).send({"erreur":"Utilisateur introuvable."})
      if (document) { 
        document.adresseLigne1 = adresseLigne1;
        document.adresseLigne2 = adresseLigne2;
        document.adresseLigne3 = adresseLigne3;
        document.CP = CP;
        document.ville = ville;
        document.telephoneport = telephoneport;
        document.telephonefixe = telephonefixe;
        document.save();
        res.send({"message": "Les données ont été sauvegardées."})
      } else
      { res.status(401).send({"erreur":"L'utilisateur est introuvable."}); }
    })
  } catch (error) {
    return res.status(500).send({"erreur":error});
  }
});

//POST REGISTER 
app.post('/register', jsonParser, function(req, res) {
  try {
    const {email, password, passwordconfirm, nom, prenom} = req.body;
    const regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    
    if (!validRequest(req)) return res.status(403).send({"erreur":"Erreur d'authentification pour utiliser l'API."});

    if (!(password === passwordconfirm)) return res.status(400).send({"erreur":"Vous devez saisir deux fois le même mot de passe."});

    if (!email) return res.status(400).send({"erreur":"Vous devez saisir votre adresse email."});
    if (!password) return res.status(400).send({"erreur":"Vous devez saisir votre mot de passe."});
    if (!nom) return res.status(400).send({"erreur":"Vous devez saisir votre nom."});
    if (!prenom) return res.status(400).send({"erreur":"Vous devez saisir votre prénom."});

    if (!regularExpression.test(password)) return res.status(400).send({"erreur":"Votre mot de passe doit contenir au moins 8 caractères, un caratère minuscule, un caractère majuscule et un caractère spécial (!@#$%^&*)."});
    
    utilisateurs.findOne(({email: email.toLowerCase()}), function(err, document) {
      if (document) return res.status(400).send({"erreur":"Cette adresse email est déjà utilisée."});

      bcrypt.genSalt(10, (err, salt) => {
        if (err) return res.status(500).send({"erreur":err.toString()});
        bcrypt.hash(password, salt, function(err, hash) {
          if (err) return res.status(500).send({"erreur":err.toString()});
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
                               mode_theme: 'light',
                               biens: []}).then(
                                res.status(201).send({"msg":"Votre compte a bien été créé."})
                               );

        });
      })
    });
  } catch (error) {
    return res.status(500).send({"erreur":error.ToString()});
  }
})

//POST ADDBIEN 
app.post('/addbien', jsonParser, function(req, res) {
  try {
    const {userid, address1, address2, address3, ville, cp, etage, residence,
           type, surfacetotale, surfacehabitable, nbchambre, nbsdb, nbpiece, classeenergie, ges, prixachat, loyermensuel, dateacquisition} = req.body;   
    if (!validRequest(req)) return res.status(403).send({"erreur":"Erreur d'authentification pour utiliser l'API."});

    utilisateurs.findById(userid, function(err, document) {
      if (err) return res.status(400).send({"erreur":"Erreur dans la récupération de l'utilisateur : " + err});

      var nouveauBien = {
        address1: address1,
        address2: address2,
        address3: address3,
        ville: ville,
        cp: cp,
        etage: etage,
        residence: residence,
        type: type,
        surfacetotale: surfacetotale,
        surfacehabitable: surfacehabitable,
        nbchambre: nbchambre,
        nbsdb: nbsdb,
        nbpiece: nbpiece,
        classeenergie: classeenergie,
        ges: ges,
        prixachat: prixachat,
        loyermensuel: loyermensuel,
        dateacquisition: dateacquisition
      }

      utilisateurs.findByIdAndUpdate(userid, { $push: {biens: nouveauBien}}, function (err, message){
        if (err) return res.status(500).send("Erreur lors de la sauvegarde du nouveau bien : " + err);
        return res.status(201).send({"msg":'Le bien a été enregistré avec succès.'});
      })
      
    });
  } catch (error) {
    return res.status(500).send({"erreur":error.ToString()});
  }
})

app.listen(process.env.PORTDEV, () => {
  console.log('Serveur API Gestion location démarrer sur http://localhost:'+ process.env.PORTDEV);
});