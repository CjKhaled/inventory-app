const { Client } = require('pg')
// require('dotenv').config({ path: path.resolve(__dirname + "../.env") })
// const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env

const SQL = `
CREATE TABLE IF NOT EXISTS meat (
id SERIAL PRIMARY KEY,
name VARCHAR(30) NOT NULL CHECK (name <> ''),
serving INT NOT NULL CHECK (serving BETWEEN 1 AND 50),
size VARCHAR(10) NOT NULL CHECK (size <> ''),
price INT NOT NULL CHECK (price BETWEEN 1 AND 10000),
count INT NOT NULL CHECK (count BETWEEN 0 AND 10000)
);

INSERT INTO meat (name, serving, size, price, count) VALUES
('Chicken', 12, 'oz', 12, 14),
('Steak', 16, 'oz', 22, 3),
('Shrimp', 20, 'oz', 16, 18),
('Ground Beef', 12, 'oz', 12, 32),
('Ham', 16, 'oz', 14, 26);

CREATE TABLE IF NOT EXISTS produce (
id SERIAL PRIMARY KEY,
name VARCHAR(30) NOT NULL CHECK (name <> ''),
serving INT NOT NULL CHECK (serving BETWEEN 1 AND 50),
size VARCHAR(10) NOT NULL CHECK (size <> ''),
price INT NOT NULL CHECK (price BETWEEN 1 AND 10000),
count INT NOT NULL CHECK (count BETWEEN 0 AND 10000)
);

INSERT INTO produce (name, serving, size, price, count) VALUES
('Apples', 1, 'lb', 3, 0),
('Bananas', 1, 'bunch', 2, 15),
('Carrots', 1, 'lb', 4, 10),
('Lettuce', 1, 'head', 2, 8),
('Tomatoes', 1, 'lb', 5, 12);

CREATE TABLE IF NOT EXISTS beverages (
id SERIAL PRIMARY KEY,
name VARCHAR(30) NOT NULL CHECK (name <> ''),
serving INT NOT NULL CHECK (serving BETWEEN 1 AND 50),
size VARCHAR(10) NOT NULL CHECK (size <> ''),
price INT NOT NULL CHECK (price BETWEEN 1 AND 10000),
count INT NOT NULL CHECK (count BETWEEN 0 AND 10000)
);

INSERT INTO beverages (name, serving, size, price, count) VALUES
('Coca-Cola', 12, 'pack', 8, 10),
('Orange Juice', 1, 'gallon', 6, 5),
('Milk', 1, 'gallon', 4, 7),
('Water', 24, 'pack', 10, 20),
('Coffee', 1, 'lb', 12, 6);

CREATE TABLE IF NOT EXISTS household (
id SERIAL PRIMARY KEY,
name VARCHAR(30) NOT NULL CHECK (name <> ''),
serving INT NOT NULL CHECK (serving BETWEEN 1 AND 50),
size VARCHAR(10) NOT NULL CHECK (size <> ''),
price INT NOT NULL CHECK (price BETWEEN 1 AND 10000),
count INT NOT NULL CHECK (count BETWEEN 0 AND 10000)
);

INSERT INTO household (name, serving, size, price, count) VALUES
('Toilet Paper', 24, 'pack', 15, 12),
('Paper Towels', 6, 'pack', 10, 8),
('Dish Soap', 1, 'bottle', 3, 14),
('Laundry Detergent', 1, 'gallon', 12, 6),
('Garbage Bags', 50, 'count', 8, 10);

CREATE TABLE IF NOT EXISTS junk (
id SERIAL PRIMARY KEY,
name VARCHAR(30) NOT NULL CHECK (name <> ''),
serving INT NOT NULL CHECK (serving BETWEEN 1 AND 50),
size VARCHAR(10) NOT NULL CHECK (size <> ''),
price INT NOT NULL CHECK (price BETWEEN 1 AND 10000),
count INT NOT NULL CHECK (count BETWEEN 0 AND 10000)
);

INSERT INTO junk (name, serving, size, price, count) VALUES
('Chips', 1, 'bag', 3, 20),
('Candy Bars', 5, 'pack', 5, 15),
('Cookies', 1, 'box', 4, 12),
('Ice Cream', 1, 'quart', 6, 0),
('Soda', 2, 'liter', 2, 25);
`

async function main() {
    console.log('populating...')
    const client = new Client({
        connectionString: `postgresql://odinproject:odin123@localhost:5432/inventory_database`
    })
    
    await client.connect()
    await client.query(SQL)
    await client.end()
    console.log('done')
}

main()