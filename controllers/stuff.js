const Sauce = require('../models/Thing');
const fs = require ('fs');

//AJOUT D UNE SAUCE
exports.createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.sauce);
  delete thingObject._id;
  const sauce = new Sauce({
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
  sauce.save().then(
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
  Sauce.findOne({_id: req.params.id})
  .then(
    (sauce) => {
      res.status(200).json(sauce);
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

  Sauce.findOne({_id: req.params.id})
  
  .then(sauce => {
    if(req.body.userIdAddedByAuth == sauce.userId){
      console.log("testid");
      console.log(req.body.userIdAddedByAuth);
      console.log(sauce.userId);
    const thingObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
    }
    else{
      res.status(403).json({message : "vous n'avez pas le droit de modifier la sauce"});
    }
  })
  .catch(error => res.status(500).json({ error }));
};

//SUPPRIMER UNE SAUCE
exports.deleteThing = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
      if(req.body.userIdAddedByAuth == sauce.userId){
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
      }
      else{
        res.status(403).json({message : "vous n'avez pas le droit de supprimer la sauce"});
      }
    })
    .catch(error => res.status(500).json({ error }));
};

// RECUPERATION DES SAUCE DISPONIBLE EN BDD
exports.getAllStuff = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
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
  Sauce.findOne({ _id: req.params.id })
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
          Sauce.updateOne({ _id: req.params.id }, futurModifBdd )
              .then(() => res.status(200).json({ message: 'avis enregistré'}))
              .catch(error => res.status(400).json({ error }))  
      })
      .catch(error => res.status(500).json({ error }));
}

