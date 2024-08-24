const pool = require('./pool')

async function getAllItems() {
    const { rows: meatdb } = await pool.query('SELECT * FROM meat')
    const { rows: producedb } = await pool.query('SELECT * FROM produce')
    const { rows: beveragesdb } = await pool.query('SELECT * FROM beverages')
    const { rows: householddb } = await pool.query('SELECT * FROM household')
    const { rows: junkdb } = await pool.query('SELECT * FROM junk')

    return [meatdb, producedb, beveragesdb, householddb, junkdb]
}

function validateTable(table) {
    const validTables = ['meat', 'produce', 'beverages', 'household', 'junk'];
    if (!validTables.includes(table)) {
        return false;
    }

    return true;
}

async function getCategoryData(table) {
    const { rows } = await pool.query(`SELECT * FROM ${table}`)
    return rows;
}

async function getItem(table, itemID) {
    const validID = parseInt(itemID);

    if (!validateTable(table) || isNaN(validID)) {
        return false;
    }

    const { rows } = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [itemID]);
    return rows;
}

async function insertItem(name, serving, size, price, count, table) {
    if (!validateTable(table)) {
        return false;
    }

    await pool.query(`INSERT INTO ${table} (name, serving, size, price, count) 
        VALUES ($1, $2, $3, $4, $5)`,[name, serving, size, price, count]);
    
    return true
}

async function findItem(name, serving, size, table) {
    if (!validateTable(table)) {
        return false;
    }

    const { rows } = await pool.query(`SELECT * FROM ${table} WHERE name = $1 AND serving = $2 AND size = $3`,
        [name, serving, size]);

    if (rows.length === 0) {
        return false;
    }

    return rows;
}

async function updateItem(name, serving, size, price, count, table) {
    // find item first
    const rows = await findItem(name, serving, size, table)

    if (!rows) {
        return false
    }

    await pool.query(`UPDATE ${table} SET price=$1, count=$2 
        WHERE name = $3 AND serving = $4 AND size = $5`, 
        [price, count, name, serving, size])
    
    return true;
}

async function deleteItem(table, itemID) {
    const rows = await getItem(table, itemID);
    if (!rows) {
        return false;
    }

    await pool.query(`DELETE FROM ${table} WHERE id=$1`, [itemID])
    return true;
}

module.exports = {
    getAllItems,
    getCategoryData,
    getItem,
    insertItem,
    updateItem, 
    deleteItem
}