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
            res.status(201).json({
              status: 'Message send!',
              message: result,
            });
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
                  res.status(201).json({
                    status: 'Message send!',
                    message: result,
                  });
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
                      res.status(201).json({
                        status: 'Message send!',
                        message: result,
                      });
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
    .then((messages) => {
      console.log(messages);
      res.status(200).json({
        status: 'Get all messages',
        count: messages.length,
        messages: messages.map((message) => {
          return {
            _id: message._id,
            title: message.title,
            feedbackLevel: message.feedbackLevel,
            feedbackType: message.feedbackType,
            feedbackLocation: message.feedbackLocation,
            isArchived: message.isArchived,
            isApproved: message.isApproved,
            isCompleted: message.isCompleted,
            createdDate: message.createdDate,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/msg/' + message._id,
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

router.get('/:messageId', (req, res, next) => {
  const id = req.params.messageId;
  Message.findById(id)
    .then((message) => {
      if (message) {
        console.log(message);
        res.status(200).json({
          status: 'Get single messages',
          message: message,
        });
      } else {
        res.status(404).json({
          status: 'Message not found!',
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

router.delete('/:messageId', (req, res, next) => {
  const id = req.params.messageId;
  Message.findByIdAndDelete(id)
    .then((result) => {
      if (!result) {
        res.status(404).json({
          status: 'Message not found!',
        });
      } else {
        console.log(result);
        res.status(200).json({
          status: 'Message delete successfully',
          message: result,
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

router.post('/approve/:messageId', (req, res, next) => {
  const date = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Bangkok',
  });
  const id = req.params.messageId;
  Message.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        isApproved: true,
        approvedDate: date,
      },
    }
  )
    .then((message) => {
      if (!message) {
        res.status(404).json({
          status:
            'Cannot approve message with' + id + '.Maybe message not found!',
        });
      } else {
        console.log(message);
        res.status(201).json({
          status: 'Message approved!',
          message: message,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/msg/' + id,
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
