const { body, validationResult } = require("express-validator");

// error messages
const itemNameLengthError = 'item name must be between 1-30 characters.'
const itemNameError = 'item name must only contain letters.'
const itemNameEmptyError = 'must provide an item name.'

const priceRangeError = 'price must be an integer between $1-$10,000.'
const priceEmptyError = 'must provide a price.'

const servingSizeRangeError = 'serving size must be an integer between 1-50'
const servingSizeEmptyError = 'must provide serving size.'

const unitEmptyError = 'must provide unit.'

const numItemsRangeError = 'number of items must be an integer between 0-10,000'
const numItemsEmptyError = 'must provide number of items.'

const categoryEmptyError = 'must provide category.'

const validateFormInput = [
  body("itemName")
    .trim()
    .notEmpty()
    .withMessage(itemNameEmptyError)
    .isLength({ min: 1, max: 30 })
    .withMessage(itemNameLengthError)
    .isAlpha()
    .withMessage(itemNameError),

  body("price")
    .trim()
    .notEmpty()
    .withMessage(priceEmptyError)
    .isInt({ min: 1, max: 10000 })
    .withMessage(priceRangeError),

  body("serving")
    .trim()
    .notEmpty()
    .withMessage(servingSizeEmptyError)
    .isInt({ min: 1, max: 50 })
    .withMessage(servingSizeRangeError),

  body("size").trim().notEmpty().withMessage(unitEmptyError),

  body("count")
    .trim()
    .notEmpty()
    .withMessage(numItemsEmptyError)
    .isInt({ min: 0, max: 10000 })
    .withMessage(numItemsRangeError),

  body("category").trim().notEmpty().withMessage(categoryEmptyError),
];

// test databases
// desc should be serving size instead
const meatdb = [
  { id: 0, name: "Chicken", serving: 12, size: 'oz', price: 12, count: 14 },
  { id: 1, name: "Steak", serving: 16, size: 'oz', price: 22, count: 3 },
  { id: 2, name: "Shrimp", serving: 20, size: 'oz', price: 16, count: 18 },
  { id: 3, name: "Ground Beef", serving: 12, size: 'oz', price: 12, count: 32 },
  { id: 4, name: "Ham", serving: 16, size: 'oz', price: 14, count: 26 },
];

const producedb = [
  { id: 0, name: "Apples", serving: 1, size: 'lb', price: 3, count: 0 },
  { id: 1, name: "Bananas", serving: 1, size: 'bunch', price: 2, count: 15 },
  { id: 2, name: "Carrots", serving: 1, size: 'lb', price: 4, count: 10 },
  { id: 3, name: "Lettuce", serving: 1, size: 'head', price: 2, count: 8 },
  { id: 4, name: "Tomatoes", serving: 1, size: 'lb', price: 5, count: 12 },
];

const beveragesdb = [
  { id: 0, name: "Coca-Cola", serving: 12, size: 'pack', price: 8, count: 10 },
  { id: 1, name: "Orange Juice", serving: 1, size: 'gallon', price: 6, count: 5 },
  { id: 2, name: "Milk", serving: 1, size: 'gallon', price: 4, count: 7 },
  { id: 3, name: "Water", serving: 24, size: 'pack', price: 10, count: 20 },
  { id: 4, name: "Coffee", serving: 1, size: 'lb', price: 12, count: 6 },
];

const householddb = [
  { id: 0, name: "Toilet Paper", serving: 24, size: 'pack', price: 15, count: 12 },
  { id: 1, name: "Paper Towels", serving: 6, size: 'pack', price: 10, count: 8 },
  { id: 2, name: "Dish Soap", serving: 1, size: 'bottle', price: 3, count: 14 },
  { id: 3, name: "Laundry Detergent", serving: 1, size: 'gallon', price: 12, count: 6 },
  { id: 4, name: "Garbage Bags", serving: 50, size: 'count', price: 8, count: 10 },
];

const junkdb = [
  { id: 0, name: "Chips", serving: 1, size: 'bag', price: 3, count: 20 },
  { id: 1, name: "Candy Bars", serving: 5, size: 'pack', price: 5, count: 15 },
  { id: 2, name: "Cookies", serving: 1, size: 'box', price: 4, count: 12 },
  { id: 3, name: "Ice Cream", serving: 1, size: 'quart', price: 6, count: 0 },
  { id: 4, name: "Soda", serving: 2, size: 'liter', price: 2, count: 25 },
];

function getDatabase(query) {
  if (query === "meat") {
    return meatdb;
  } else if (query === "produce") {
    return producedb;
  } else if (query === "beverages") {
    return beveragesdb;
  } else if (query === "household") {
    return householddb;
  } else if (query === "junk") {
    return junkdb;
  } else {
    return null; // or you could return an empty array if no match is found
  }
}

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
  res.render('index', { currentPage: 'form', action: 'new', category: null, name: null, price: null, serving: null, size: null, count: null })
}

function getUpdateForm(req, res) {
  const { category, name, price, serving, size, count } = req.params
  res.render('index', { currentPage: 'form', action: 'update', category: category, name: name, price: price, serving: serving, size: size, count: count })
}

async function getSingleItem(req, res) {
  const category = req.params.category
  const itemID = parseInt(req.params.itemID)
  const item = getDatabase(category)[itemID]
  res.render('index', { currentPage: 'item', item: item, category: category })
}

const postNewItem = [validateFormInput, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).render('index', { errors: errors.array(), currentPage: 'form', action: 'new', category: null, name: null, price: null, serving: null, size: null, count: null })
  }

  // no errors
  const { itemName, itemNumber, itemPrice, itemCategory } = req.body;
  console.log(itemName, itemNumber, itemPrice, itemCategory);
  res.redirect("/");
}]

const postUpdatedItem = [validateFormInput, async (req, res) => {
  const { category, name, price, serving, size, count } = req.params;
  if (!errors.isEmpty()) {
    return res.status(400).render('index', { errors: errors.array(), currentPage: 'form', action: 'update',  category: category, name: name, price: price, serving: serving, size: size, count: count })
  }

  // imagine that there is a function here
  // it returns a boolean that determines whether or not it can find
  // an item in the database that's equal to name, serving, size, and category

  // handle finding or not finding the item here
  console.log(category, name, price, serving, size, count);
  res.redirect('/')
}]

module.exports = {
  getDashboard,
  getMeat,
  getProduce,
  getBeverages,
  getHousehold,
  getJunk,
  getForm,
  getUpdateForm,
  getSingleItem,
  postNewItem,
  postUpdatedItem
};
