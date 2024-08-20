const express = require("express");
const controller = require("../controllers/indexController");
const router = express.Router();

router.get('/', controller.getDashboard)
router.get('/meat', controller.getMeat)
router.get('/produce', controller.getProduce)
router.get('/beverages', controller.getBeverages)
router.get('/household', controller.getHousehold)
router.get('/junk', controller.getJunk)
router.get('/new', controller.getForm)

module.exports = router