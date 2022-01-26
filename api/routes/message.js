const express = require('express');
const router = express.Router();

const Message = require('../models/message');
const Room = require('../models/room');
const Department = require('../models/department');
const Floor = require('../models/floor');

router.post('/', (req, res, next) => {
  Room.findById({ _id: req.body.feedbackLocation })
    .then((room) => {
      if (room) {
        const message = new Message({
          title: req.body.title,
          message: req.body.message,
          feedbackLevel: req.body.feedbackLevel,
          createdDate: new Date(),
          feedbackType: req.body.feedbackType,
          feedbackLocation: room,
        });
        message
          .save()
          .then((result) => {
            console.log(result);
            res.status(201).json(result);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: err,
            });
          });
      } else {
        Department.findById({ _id: req.body.feedbackLocation })
          .then((department) => {
            if (department) {
              const message = new Message({
                title: req.body.title,
                message: req.body.message,
                feedbackLevel: req.body.feedbackLevel,
                createdDate: new Date(),
                feedbackType: req.body.feedbackType,
                feedbackLocation: department,
              });
              message
                .save()
                .then((result) => {
                  console.log(result);
                  res.status(201).json(result);
                })
                .catch((err) => {
                  console.log(err);
                  res.status(500).json({
                    error: err,
                  });
                });
            } else {
              Floor.findById({ _id: req.body.feedbackLocation })
                .then((floor) => {
                  const message = new Message({
                    title: req.body.title,
                    message: req.body.message,
                    feedbackLevel: req.body.feedbackLevel,
                    createdDate: new Date(),
                    feedbackType: req.body.feedbackType,
                    feedbackLocation: floor,
                  });
                  message
                    .save()
                    .then((result) => {
                      console.log(result);
                      res.status(201).json(result);
                    })
                    .catch((err) => {
                      console.log(err);
                      res.status(500).json({
                        error: err,
                      });
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

router.get('/', (req, res, next) => {
  Message.find()
    .exec()
    .then((docs) => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
// router.get('/', (req, res, next) => {});
// router.get('/', (req, res, next) => {});

module.exports = router;
