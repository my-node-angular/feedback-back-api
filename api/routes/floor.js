const express = require('express');
const router = express.Router();

const Floor = require('../models/floor');

router.get('/', (req, res, next) => {
  Floor.find()
    .select('name _id')
    .exec()
    .then((floors) => {
      res.status(200).json({
        status: 'Get all flooor',
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
          status: 'This Floor Exist',
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
              status: 'floor created',
              floor: {
                name: result.name,
                _id: result._id,
              },
              request: {
                type: 'GET',
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
          status: 'Get single flooor',
          floor: floor,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/floors/',
          },
        });
      } else {
        return res.status(404).json({
          message: 'Floor not found!',
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
  Floor.findByIdAndDelete(id)
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          status: 'Floor not found!',
        });
      } else {
        res.status(200).json({
          status: 'Floor delete successfully!',
          floor: result,
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

router.put('/:floorId', (req, res, next) => {
  const id = req.params.floorId;
  if (!req.body) {
    return res.status(400).json({
      status: 'Data to update can not be empty',
    });
  }
  Floor.findByIdAndUpdate(id, req.body)
    .then((floor) => {
      if (!floor) {
        return res.status(404).json({
          status: 'Floor not found!',
        });
      } else {
        res.status(200).json({
          status: 'Update floor successfull',
          floor: {
            _id: floor._id,
          },
          request: {
            type: 'GET',
            url: 'http://localhost:3000/floors/' + floor._id,
          },
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

module.exports = router;
