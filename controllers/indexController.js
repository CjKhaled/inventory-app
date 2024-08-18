const { body, validationResult } = require("express-validator");

// error messages

const validateUser = [];

async function getDashboard(req, res) {
  res.send("This should be dashboard");
}

async function getItems(req, res) {
  res.send("This should be all items in database");
}

async function getMeat(req, res) {
  res.send("These should be all meat in database");
}

async function getProduce(req, res) {
  res.send("These should be all produce in database");
}

async function getBeverages(req, res) {
  res.send("These should be all beverages in database");
}

async function getHousehold(req, res) {
  res.send("These should be all household in database");
}

async function getJunk(req, res) {
  res.send("These should be all junk in database");
}

async function addItem(req, res) {
  const itemName = req.body.itemName;
  const itemNumber = req.body.itemNumber;
  const itemPrice = req.body.itemPrice;
  const itemCategory = req.body.itemCategory;

  // if already in database, just update existing item
}

module.exports = {
  getDashboard,
  getItems,
  getMeat,
  getProduce,
  getBeverages,
  getHousehold,
  getJunk,
  addItem,
};
