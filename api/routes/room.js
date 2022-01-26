const express = require('express');
const router = express.Router();

const Room = require('../models/room');
const Department = require('../models/department');

router.get('/', (req, res, next) => {
  Room.find()
    .select('name departmentId')
    .populate([
      {
        path: 'departmentId',
        select: ['name'],
        populate: { path: 'floorId', select: ['name'] },
      },
    ])
    .exec()
    .then((rooms) => {
      console.log(rooms);
      res.status(200).json({
        count: rooms.length,
        room: rooms.map((room) => {
          return {
            _id: room._id,
            name: room.name,
            department: room.departmentId,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/rooms/' + room._id,
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
  Room.find({ name: req.body.name })
    .exec()
    .then((room) => {
      if (room && room.length) {
        return res.status(409).json({
          message: 'This Room Exist',
        });
      } else {
        Department.findById(req.body.departmentId)
          .then((department) => {
            if (!department) {
              return res.status(404).json({
                message: 'Department not found!',
              });
            } else {
              const room = new Room({
                name: req.body.name,
                departmentId: req.body.departmentId,
              });
              room
                .save()
                .then((result) => {
                  console.log(result);
                  res.status(201).json({
                    message: 'Room Created',
                    room: {
                      _id: result._id,
                      name: result.name,
                      departmentId: result.departmentId,
                    },
                    request: {
                      type: 'GET',
                      url: 'http://localhost:3000/rooms/' + result._id,
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
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: err,
            });
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

router.get('/:roomId', (req, res, next) => {
  const id = req.params.roomId;
  Room.findById(id)
    .populate([
      {
        path: 'departmentId',
        select: ['name'],
        populate: { path: 'floorId', select: ['name'] },
      },
    ])
    .then((result) => {
      console.log(result);
      if (result) {
        res.status(200).json({
          room: result,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/rooms/',
          },
        });
      } else {
        res.status(404).json({
          message: 'No room found!',
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

router.delete('/:roomId', (req, res, next) => {
  const id = req.params.roomId;
  Room.remove({ _id: id })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: 'Delete successfully!',
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
