const express = require('express');
const router = express.Router();

const Floor = require('../models/floor');

router.get('/', (req, res, next) => {
  Floor.find()
    .select('name _id')
    .exec()
    .then((floors) => {
      res.status(200).json({
        count: floors.length,
        floors: floors.map((floor) => {
          return {
            _id: floor._id,
            name: floor.name,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/floors/' + floor._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post('/', (req, res, next) => {
  Floor.find({ name: req.body.name })
    .exec()
    .then((floor) => {
      if (floor && floor.length) {
        return res.status(409).json({
          message: 'This Floor Exist',
        });
      } else {
        const floor = new Floor({
          name: req.body.name,
        });
        floor
          .save()
          .then((result) => {
            console.log(result);
            res.status(201).json({
              message: 'floor created',
              floor: {
                name: result.name,
                _id: result._id,
              },
              request: {
                type: 'POST',
                url: 'http://localhost:3000/floors/' + result._id,
              },
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: err,
            });
          });
      }
    });
});

router.get('/:floorId', (req, res, next) => {
  const id = req.params.floorId;
  Floor.findById(id)
    .select('name _id')
    .exec()
    .then((floor) => {
      console.log(floor);
      if (floor) {
        res.status(200).json({
          floor: floor,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/floors/',
          },
        });
      } else {
        res.status(404).json({
          message: 'No valid entry found',
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete('/:floorId', (req, res, next) => {
  const id = req.params.floorId;
  Floor.remove({ _id: id })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(600).json({
        error: err,
      });
    });
});

router.patch('/:floorId', (req, res, next) => {
  const id = req.params.floorId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Floor.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: 'Floor Updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/floors/' + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
