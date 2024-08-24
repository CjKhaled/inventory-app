const { body, validationResult } = require("express-validator");
const db = require('../db/queries')

// error messages
const itemNameLengthError = "item name must be between 1-30 characters.";
const itemNameError = "item name must only contain letters.";
const itemNameEmptyError = "must provide an item name.";

const priceRangeError = "price must be an integer between $1-$10,000.";
const priceEmptyError = "must provide a price.";

const servingSizeRangeError = "serving size must be an integer between 1-50";
const servingSizeEmptyError = "must provide serving size.";

const unitEmptyError = "must provide unit.";

const numItemsRangeError =
  "number of items must be an integer between 0-10,000";
const numItemsEmptyError = "must provide number of items.";

const categoryEmptyError = "must provide category.";

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

const validateUpdateFormInput = [
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

function getInventoryStats(databases) {
  let totalItems = 0;
  let lowStockItems = 0;
  let outOfStockItems = 0;
  let totalCost = 0;
  let databasePercentages = [];
  let valuePercentages = [];

  databases.forEach((db) => {
    db.forEach((item) => {
      totalItems += item.count;

      if (item.count === 0) {
        outOfStockItems++;
      } else if (item.count < 5) {
        // Low stock can be defined as any number, it's 5 here
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

async function getDashboard(req, res) {
  const allDatabases = await db.getAllItems();
  const inventoryStats = getInventoryStats(allDatabases);
  const { success, method } = req.query;
  if (success && method) {
    return res.render("index", {
      currentPage: "dashboard",
      stats: inventoryStats,
      success: success,
      method: method,
    });
  }

  res.render("index", {
    currentPage: "dashboard",
    stats: inventoryStats,
    success: false,
    method: null,
  });
}

async function getMeat(req, res) {
  const meatdb = await db.getCategoryData('meat')
  res.render("index", { currentPage: "meat", items: meatdb });
}

async function getProduce(req, res) {
  const producedb = await db.getCategoryData('produce')
  res.render("index", { currentPage: "produce", items: producedb });
}

async function getBeverages(req, res) {
  const beveragesdb = await db.getCategoryData('beverages')
  res.render("index", { currentPage: "beverages", items: beveragesdb });
}

async function getHousehold(req, res) {
  const householddb = await db.getCategoryData('household')
  res.render("index", { currentPage: "household", items: householddb });
}

async function getJunk(req, res) {
  const junkdb = await db.getCategoryData('junk')
  res.render("index", { currentPage: "junk", items: junkdb });
}

function getForm(req, res) {
  res.render("index", {
    currentPage: "form",
    action: "new",
    category: null,
    name: null,
    price: null,
    serving: null,
    size: null,
    count: null,
  });
}

function getUpdateForm(req, res) {
  const { category, name, price, serving, size, count } = req.params;
  res.render("index", {
    currentPage: "form",
    action: "update",
    category: category,
    name: name,
    price: price,
    serving: serving,
    size: size,
    count: count,
  });
}

async function getSingleItem(req, res) {
  const category = req.params.category;
  const itemID = parseInt(req.params.itemID);
  const item = await db.getItem(category, itemID);
  if (!item) {
    // bad input
    return res.redirect("/?success=false&method=unknown")
  }
  res.render("index", { currentPage: "item", item: item[0], category: category });
}

const postNewItem = [
  validateFormInput,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render("index", {
          errors: errors.array(),
          currentPage: "form",
          action: "new",
          category: null,
          name: null,
          price: null,
          serving: null,
          size: null,
          count: null,
        });
    }

    const { itemName, serving, size, price, count, category } = req.body;
    const result = await db.insertItem(itemName, serving, size, price, count, category)
    if (!result) {
      res.redirect("/?success=true&method=new")
    }

    res.redirect("/?success=true&method=new");
  },
];

const postUpdatedItem = [
  validateUpdateFormInput,
  async (req, res) => {
    const { itemName, serving, size, price, count, category } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render("index", {
          errors: errors.array(),
          currentPage: "form",
          action: "update",
          category: category,
          name: itemName,
          price: price,
          serving: serving,
          size: size,
          count: count,
        });
    }

    const result = await db.updateItem(itemName, serving, size, price, count, category)
    if (!result) {
      res.redirect("/?success=false&method=update")
    }
    res.redirect("/?success=true&method=update");
  },
];

async function deleteItem(req, res) {
  const userInput = req.body.masterKey
  const { category, itemID } = req.params
  if (process.env.MASTERKEY === userInput) {
    const result = await db.deleteItem(category, itemID)
    if (result) {
      return res.redirect("/?success=true&method=delete")
    }
  }

  // password is wrong
  res.redirect("/?success=false&method=delete")
}

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
  postUpdatedItem,
  deleteItem
};
