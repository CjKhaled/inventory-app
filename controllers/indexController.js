const { body, validationResult } = require("express-validator");

// error messages

const validateUser = [];

// test databases
const meatdb = [
  { id: 0, name: "Chicken", desc: "12 oz of chicken", price: 12, count: 14 },
  { id: 1, name: "Steak", desc: "16 oz of steak", price: 22, count: 3 },
  { id: 2, name: "Shrimp", desc: "20 oz of shrimp", price: 16, count: 18 },
  { id: 3, name: "Ground Beef", desc: "12 oz of ground beef", price: 12, count: 32 },
  { id: 4, name: "Ham", desc: "16 oz of ham", price: 14, count: 26 },
];

const producedb = [
  { id: 0, name: "Apples", desc: "1 lb of apples", price: 3, count: 0 },
  { id: 1, name: "Bananas", desc: "1 bunch of bananas", price: 2, count: 15 },
  { id: 2, name: "Carrots", desc: "1 lb of carrots", price: 4, count: 10 },
  { id: 3, name: "Lettuce", desc: "1 head of lettuce", price: 2, count: 8 },
  { id: 4, name: "Tomatoes", desc: "1 lb of tomatoes", price: 5, count: 12 },
];

const beveragesdb = [
  { id: 0, name: "Coca-Cola", desc: "12-pack of Coca-Cola", price: 8, count: 10 },
  { id: 1, name: "Orange Juice", desc: "1 gallon of orange juice", price: 6, count: 5 },
  { id: 2, name: "Milk", desc: "1 gallon of milk", price: 4, count: 7 },
  { id: 3, name: "Water", desc: "24-pack of bottled water", price: 10, count: 20 },
  { id: 4, name: "Coffee", desc: "1 lb of ground coffee", price: 12, count: 6 },
];

const householddb = [
  { id: 0, name: "Toilet Paper", desc: "24-pack of toilet paper", price: 15, count: 12 },
  { id: 1, name: "Paper Towels", desc: "6-pack of paper towels", price: 10, count: 8 },
  { id: 2, name: "Dish Soap", desc: "1 bottle of dish soap", price: 3, count: 14 },
  { id: 3, name: "Laundry Detergent", desc: "1 gallon of laundry detergent", price: 12, count: 6 },
  { id: 4, name: "Garbage Bags", desc: "50-count of garbage bags", price: 8, count: 10 },
];

const junkdb = [
  { id: 0, name: "Chips", desc: "1 bag of potato chips", price: 3, count: 20 },
  { id: 1, name: "Candy Bars", desc: "5-pack of candy bars", price: 5, count: 15 },
  { id: 2, name: "Cookies", desc: "1 box of cookies", price: 4, count: 12 },
  { id: 3, name: "Ice Cream", desc: "1 quart of ice cream", price: 6, count: 0 },
  { id: 4, name: "Soda", desc: "2-liter bottle of soda", price: 2, count: 25 },
];

function getInventoryStats(databases) {
  let totalItems = 0;
  let lowStockItems = 0;
  let outOfStockItems = 0;
  let totalCost = 0;
  let databasePercentages = [];
  let valuePercentages = [];

  // First, calculate the total stock and total value across all databases
  databases.forEach((db) => {
    db.forEach((item) => {
      totalItems += item.count;

      if (item.count === 0) {
        outOfStockItems++;
      } else if (item.count < 5) {
        // Assuming low stock is defined as less than 5
        lowStockItems++;
      }

      totalCost += item.count * item.price;
    });
  });

  // Calculate the percentage of stock for each database
  databases.forEach((db) => {
    let dbTotalItems = db.reduce((sum, item) => sum + item.count, 0);
    let dbTotalValue = db.reduce(
      (sum, item) => sum + item.count * item.price,
      0
    );
    let percentage = totalItems > 0 ? (dbTotalItems / totalItems) * 100 : 0;
    let valuePercentage = totalCost > 0 ? (dbTotalValue / totalCost) * 100 : 0;

    databasePercentages.push(percentage);
    valuePercentages.push(valuePercentage);
  });

  return {
    totalItems,
    lowStockItems,
    outOfStockItems,
    totalCost,
    databasePercentages,
    valuePercentages,
  };
}


// Example usage:
const allDatabases = [meatdb, producedb, beveragesdb, householddb, junkdb];
const inventoryStats = getInventoryStats(allDatabases);

async function getDashboard(req, res) {
  res.render("index", { currentPage: "dashboard", stats: inventoryStats });
}

async function getMeat(req, res) {
  res.render("index", { currentPage: "meat", items: meatdb });
}

async function getProduce(req, res) {
  res.render("index", { currentPage: "produce", items: producedb });
}

async function getBeverages(req, res) {
  res.render("index", { currentPage: "beverages", items: beveragesdb });
}

async function getHousehold(req, res) {
  res.render("index", { currentPage: "household", items: householddb });
}

async function getJunk(req, res) {
  res.render("index", { currentPage: "junk", items: junkdb });
}

function getForm(req, res) {
  res.render('index', { currentPage: 'form' })
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
  getForm,
  addItem,
};
