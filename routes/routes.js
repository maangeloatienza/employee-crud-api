const express = require('express');
const importer = require('anytv-node-importer');
const router = express.Router();


const authorization = require('./../middleware/authorization');
const __ = importer.dirloadSync(__dirname + '/../controllers/v1');


router.get ('/users',                       __.userController.index);
router.get ('/users/:id',                   __.userController.show);
router.post('/users',                       __.userController.store);
router.put ('/users/:id',   authorization,  __.userController.update);
router.delete('/users/:id', authorization,  __.userController.remove);

router.get ('/employees',                   __.employeeController.index);
router.get ('/employees/:id',               __.employeeController.show);
router.post('/employees',                   __.employeeController.store);
router.put ('/employees/:id',               __.employeeController.update);
router.delete ('/employees/:id',            __.employeeController.remove);


router.post('/login', __.authenticationController.login);


module.exports = router;