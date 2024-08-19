const { body, validationResult } = require("express-validator");

// error messages

const validateUser = [];

async function getDashboard(req, res) {
  res.render('index', {currentPage: 'dashboard'});
}

async function getMeat(req, res) {
  res.render("index", { currentPage: "meat" });
}

async function getProduce(req, res) {
  res.render("index", { currentPage: "produce" });
}

async function getBeverages(req, res) {
  res.render("index", { currentPage: "beverages" });
}

async function getHousehold(req, res) {
  res.render("index", { currentPage: "household" });
}

async function getJunk(req, res) {
  res.render("index", { currentPage: "junk" });
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
  getMeat,
  getProduce,
  getBeverages,
  getHousehold,
  getJunk,
  addItem,
};
