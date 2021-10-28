const Thing = require('../models/Thing');
const fs = require ('fs');
const Like = require('../models/Like');

//AJOUT D UNE SAUCE
exports.createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.sauce);
  delete thingObject._id;
  const thing = new Thing({
    name: thingObject.name,
    manufacturer: thingObject.manufacturer,
    description: thingObject.description,
    mainPepper: thingObject.mainPepper,
    heat: thingObject.heat,
    likes: 0,
    dislikes: 0,
    usersLiked:[],
    usersDisliked: [],
    userId: thingObject.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  //SAUVEGARDE  DE LA CREATION DE SAUCE EN BDD
  thing.save().then(
    () => {
      res.status(201).json({
        message: 'Sauce ajouté'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

//AFFICHAGE D UNE SAUCE
exports.getOneThing = (req, res, next) => {
  Thing.findOne({_id: req.params.id})
  .then(
    (thing) => {
      res.status(200).json(thing);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

//MODIFICATION D UNE SAUCE
exports.modifyThing = (req, res, next) => {
  const thingObject = req.file ?
    {
      ...JSON.parse(req.body.thing),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

//SUPPRIMER UNE SAUCE
exports.deleteThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then(thing => {
      const filename = thing.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Thing.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// RECUPERATION DES SAUCE DISPONIBLE EN BDD
exports.getAllStuff = (req, res, next) => {
  Thing.find().then(
    (things) => {
      res.status(200).json(things);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

//GESTION DES LIKES 
exports.createLike = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
      .then(sauce => {
          const futurModifBdd = {
              usersLiked: sauce.usersLiked,
              usersDisliked: sauce.usersDisliked,
              likes: 0,
              dislikes: 0
          }
          // GESTION DES TABLEAUX USERSLIKE DISLIKE
          switch (req.body.like) {
              case 1:
              futurModifBdd.usersLiked.push(req.body.userId);
                  break;
              case -1:  
              futurModifBdd.usersDisliked.push(req.body.userId);
                  break;
              case 0:  
                  if (futurModifBdd.usersLiked.includes(req.body.userId)) {
                      
                      const index = futurModifBdd.usersLiked.indexOf(req.body.userId);
                      futurModifBdd.usersLiked.splice(index, 1);
                  } else {
                      
                      const index = futurModifBdd.usersDisliked.indexOf(req.body.userId);
                      futurModifBdd.usersDisliked.splice(index, 1);
                  }
                  break;
          };
          // GESTION DU NOMBRE DE LIKE
          futurModifBdd.likes = futurModifBdd.usersLiked.length;
          futurModifBdd.dislikes = futurModifBdd.usersDisliked.length;
          // UPDATE
          Thing.updateOne({ _id: req.params.id }, futurModifBdd )
              .then(() => res.status(200).json({ message: 'avis enregistré'}))
              .catch(error => res.status(400).json({ error }))  
      })
      .catch(error => res.status(500).json({ error }));
}

