const express = require("express");
const controller = require("../controllers/indexController");
const router = express.Router();

router.get("/", controller.getDashboard);
router.get("/meat", controller.getMeat);
router.get("/produce", controller.getProduce);
router.get("/beverages", controller.getBeverages);
router.get("/household", controller.getHousehold);
router.get("/junk", controller.getJunk);
router.get("/new", controller.getForm);
router.get("/:category/:itemID", controller.getSingleItem);
router.get(
  "/update/:category/:name/:price/:serving/:size/:count",
  controller.getUpdateForm
);

router.post("/new", controller.postNewItem);
router.post(
  "/update/:category/:name/:price/:serving/:size/:count",
  controller.postUpdatedItem
);
router.post('/delete/:category/:itemID', controller.deleteItem)

module.exports = router;
