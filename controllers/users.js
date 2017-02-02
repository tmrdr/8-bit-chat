var express = require('express');
var User = require('../models/user');
var router = express.Router();

router.route('/')
  .get(function(req, res) {
    console.log('getting');
    User.find(function(err, users) {
      if (err) return res.status(500).send(err);

      return res.send(users);
    });
  })
  .post(function(req, res) {
    // find the user first in case the email already exists
    User.findOne({ name: req.body.name }, function(err, user) {
      if (user) return res.status(400).send({ message: 'Username already exists' });

      User.create(req.body, function(err, user) {
        if (err) return res.status(500).send(err);

        return res.send(user);
      });
    });
  });

  router.route('/:id')
  .put(function(req,res) {
    console.log("GOT USER", req.params.id)
    console.log("GOT PARAMS", req.body)
    User.findByIdAndUpdate(req.params.id, req.body, function(err) {
      if (err) return res.status(500).send(err);
      res.send({'message': 'success'});
    });
  })

// router.get('/:id', function(req, res) {
//   User.findById(req.params.id, function(err, user) {
//     if (err) return res.status(500).send(err);
//
//     return res.send(user);
//   });
// });

module.exports = router;
