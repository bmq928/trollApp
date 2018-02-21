const route = require('express').Router();
const dirCtrl = require('../controllers/dirCtrl')

// init state, get all directory in media folder
route.get('/dir', dirCtrl.dir)

module.exports = route;