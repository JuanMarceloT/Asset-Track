const { checkPrime } = require('crypto');
const { findSourceMap } = require('module');
const { type } = require('os');
const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'admin',
  password: 'admin',
  port: 5439 // Default port for PostgreSQL
});

(async () => {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database!');

    //DeleteAllTables();
    CriarTabelaUsuarios();
    CriarTabelaStocks();
    CriarTabelaTransaçõess();
    //const res = await client.query(query);
    //const users = res.rows; // Array of objects containing retrieved data

    CriaUsuario("Juan");
    await Nova_Tranasção(16, 6, 'BUY', 100, 600.64, formatDate(2024, 1, 5));
    //InsertStock(2,5,24,2,formatDate(2021,2,1));
    //SelectStocks();

    //SelectUsers();
    SelectUser(16);


    //console.log(users);


  } catch (error) {
    console.error('Connection error:', error);
  }
})();


async function DeleteAllTables() {
  const getTablesQuery = `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = current_schema()
    AND table_type = 'BASE TABLE';
  `;

  try {
    const tablesResult = await executeQuery(getTablesQuery);

    for (const table of tablesResult) {
      const dropTableQuery = `DROP TABLE IF EXISTS "${table.table_name}" CASCADE;`;
      await executeQuery(dropTableQuery);
      console.log(`Table ${table.table_name} deleted successfully.`);
    }

    console.log('All tables deleted successfully.');
  } catch (error) {
    console.error('Error deleting tables:', error);
    throw error;
  }
}

async function CriarTabelaUsuarios() {
  const query = `CREATE TABLE IF NOT EXISTS USUARIO (
    ID SERIAL PRIMARY KEY,
    NAME VARCHAR(255) NOT NULL
  ) WITH (OIDS=FALSE);  -- Avoid Object Identifier bloat
  
  ALTER TABLE USUARIO
    ADD COLUMN IF NOT EXISTS NAME VARCHAR(255) NOT NULL;  -- Add NAME if missing
  
  ALTER TABLE USUARIO
    ALTER COLUMN NAME SET DATA TYPE VARCHAR(255)  -- Update data type if necessary
    USING NAME::VARCHAR(255);  -- Cast existing data to new type (if data type changed)
  ;`
  executeQuery(query);
}

async function CriarTabelaStocks() {
  const query = `CREATE TABLE IF NOT EXISTS STOCKS (
      User_ID INTEGER PRIMARY KEY REFERENCES USUARIO(ID),
      STOCK_ID INTEGER,
      STOCK_NAME VARCHAR(255),
      AVG_PRICE DECIMAL(10,2) NOT NULL,  
      UNITS INTEGER NOT NULL  
  )
  ;`
  executeQuery(query);
}

async function CriarTabelaTransaçõess() {
  const query = `CREATE TABLE IF NOT EXISTS TRANSACTIONS (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES USUARIO(id),
      stock_id INTEGER NOT NULL,
      transaction_type VARCHAR(25) NOT NULL CHECK (transaction_type IN ('BUY', 'SELL')),
      units INTEGER NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    ALTER TABLE TRANSACTIONS
        ALTER COLUMN stock_id SET DATA TYPE INTEGER  -- Update data type if necessary;
  `;
  executeQuery(query);
}

async function Nova_Tranasção(user_id, stock_id, transaction_type, units, price, date) {
  const query = `
    INSERT INTO TRANSACTIONS (user_id, stock_id, transaction_type, units, price, timestamp)
    VALUES ($1, $2, $3, $4, $5, $6);
  `;
  const values = [user_id, stock_id, transaction_type, units, price, date];
  await InsertStock(user_id,stock_id,units,price);

  try {
    await executeQuery(query, values);
    //console.log('Transaction inserted successfully.');
  } catch (error) {
    console.error('Error inserting transaction:', error);
  }

}




async function SelectUsers() {
  const query = `select * from USUARIO;`;
  const result = await executeQuery(query);
  console.log(result);
}

async function SelectStocks() {
  const query = `select * from stocks;`;
  const result = await executeQuery(query);
  console.log(result);
}

async function SelectUser(id) {
  const userQuery = `
    SELECT *
    FROM USUARIO
    WHERE id = $1
    LIMIT 1;
  `;
  const userValues = [id];

  try {
    const userResult = await executeQuery(userQuery, userValues);
    if (userResult.length === 0) {
      throw new Error('User not found');
    }

    const user = userResult[0];

    const transactionsQuery = `
      SELECT *
      FROM transactions
      WHERE user_id = $1;
    `;
    const transactionsValues = [id];
    const transactionsResult = await executeQuery(transactionsQuery, transactionsValues);

    const StocksQuery = `
      SELECT *
      FROM stocks
      WHERE user_id = $1;
    `;
    const StocksValues = [id];
    const StocksResult = await executeQuery(StocksQuery, StocksValues);

    const userWithTransactions = {
      id: user.id,
      name: user.name,
      stocks: StocksResult,
      transactions: transactionsResult
    };

    console.log(userWithTransactions);
  } catch (error) {
    console.error('Error selecting user with transactions:', error);
  }
}



async function CriaUsuario(nome) {


  // Prepared statement to prevent SQL injection vulnerabilities
  const query = `INSERT INTO USUARIO (NAME) VALUES ('${nome}') RETURNING id`;

  try {
    const result = await executeQuery(query);
    const userId = result; // Assuming 'id' is the returned column name
    console.log(userId);
    return userId;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error; // Re-throw the error to propagate it if needed
  }
}



async function executeQuery(query, values) {
  //const client = await client.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(query, values);
    await client.query('COMMIT');
    return result.rows;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
}

function formatDate(year, month, day) {
  // Ensure month and day are two digits
  const formattedMonth = String(month).padStart(2, '0');
  const formattedDay = String(day).padStart(2, '0');

  // Create a new Date object with the specified year, month, and day
  const date = new Date(year, month - 1, day); // Note: Month is zero-based in JavaScript dates

  // Format the date as 'YYYY-MM-DD'
  const formattedDate = `${date.getFullYear()}-${formattedMonth}-${formattedDay}`;

  return formattedDate;
}

function GetStockNameByID(stock_id) {
  return 'none';
}


async function InsertStock(user_id, stock_id, units, price, TYPE) {

  try {
    const FindSameStockQuery = `
      SELECT *
      FROM stocks
      WHERE user_id = $1
      AND stock_id = $2
      ;
      ` ;
    const CheckStock = await executeQuery(FindSameStockQuery, [user_id, stock_id]);
    //console.log(CheckStock[0].units);

    if (CheckStock.length > 0) {

      const updateQuery = `
        UPDATE stocks
        SET units = CAST($1 AS DECIMAL(10,2)), AVG_PRICE = $2
        WHERE user_id = $3
        AND stock_id = $4
        RETURNING *;
      `;

      if(type == 'BUY'){
        let new_avg_price = (CheckStock[0].units * CheckStock[0].avg_price + units * price) / (CheckStock[0].units + units);
        const updateResult = await executeQuery(updateQuery, [(CheckStock[0].units + units), new_avg_price, user_id, stock_id]);
      }
      if(type == 'SELL'){
        let new_avg_price = (CheckStock[0].units * CheckStock[0].avg_price - units * price) / (CheckStock[0].units - units);
        const updateResult = await executeQuery(updateQuery, [(CheckStock[0].units - units), new_avg_price, user_id, stock_id]);
      }
    } else {
       const createStockQuery = `
        INSERT INTO stocks (user_id, stock_id, STOCK_NAME, units, avg_price)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const createStockValues = await executeQuery(createStockQuery, [user_id, stock_id, GetStockNameByID(stock_id), units, price]);

    }
  } catch (EX){
    console.log(EX);
   }

}