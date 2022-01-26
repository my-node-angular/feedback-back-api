const express = require('express');
const router = express.Router();

const Department = require('../models/department');
const Floor = require('../models/floor');

router.get('/', (req, res, next) => {
  Department.find()
    .select('name floorId _id')
    .populate({ path: 'floorId', select: ['name'] })
    .exec()
    .then((departments) => {
      res.status(200).json({
        count: departments.length,
        departments: departments.map((department) => {
          return {
            _id: department._id,
            name: department.name,
            floor: department.floorId,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/departments/' + department._id,
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
  Department.find({ name: req.body.name })
    .exec()
    .then((depart) => {
      if (depart && depart.length) {
        return res.status(409).json({
          message: 'This Department Exist',
        });
      } else {
        Floor.findById(req.body.floorId)
          .then((floor) => {
            if (!floor) {
              return res.status(404).json({
                message: 'Floor not found!',
              });
            } else {
              const department = new Department({
                name: req.body.name,
                floorId: req.body.floorId,
              });
              department
                .save()
                .then((result) => {
                  console.log(result);
                  res.status(201).json({
                    message: 'Department created',
                    department: {
                      _id: result._id,
                      name: result.name,
                      floorId: result.floorId,
                    },
                    request: {
                      type: 'GET',
                      url: 'http://localhost:3000/departments/' + result._id,
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

router.get('/:departmentId', (req, res, next) => {
  const id = req.params.departmentId;
  Department.findById(id)
    .select('name floorId _id')
    .populate({ path: 'floorId', select: ['name'] })
    .exec()
    .then((department) => {
      console.log(department);
      if (department) {
        res.status(200).json({
          department: department,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/departments/',
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

router.delete('/:departmentId', (req, res, next) => {
  const id = req.params.departmentId;
  Department.remove({ _id: id })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
router.patch('/:departmentId', (req, res, next) => {
  const id = req.params.departmentId;
  const updateOps = {};
  for (let ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Department.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      if (result) {
        res.status(200).json({
          message: 'Department Updated',
          request: {
            type: 'GET',
            url: 'http://localhost:3000/departments/' + id,
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
