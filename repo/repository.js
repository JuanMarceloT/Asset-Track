
const { type } = require('os');
const pool = require('./db');
const { get } = require('https');
const { promises } = require('dns');
const { get_stock_name_by_id, get_stock_img_by_id, get_stock_code_by_id } = require('../utils/stocks_hash_map.js');
const { ok } = require('assert');




async function inicializarDb() {
  try {
    await pool.connect();
    //console.log('Connected to PostgreSQL database!');

    //DeleteAllTables();
    await CriarTabelaUsuarios();
    await CriarTabelaStocks();
    await CriarTabelaTransaçõess();
    //await CriaUsuario("Juan");
    //const res = await pool.query(query);
    //const users = res.rows; // Array of objects containing retrieved data
  } catch (ex) {
    console.log(ex);
  }
}


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
      //console.log(`Table ${table.table_name} deleted successfully.`);
    }

    //console.log('All tables deleted successfully.');
  } catch (error) {
    console.error('Error deleting tables:', error);
    throw error;
  }
}

async function CriarTabelaUsuarios() {
  const query = `CREATE TABLE IF NOT EXISTS USUARIO (
      ID SERIAL PRIMARY KEY,
      NAME VARCHAR(255) NOT NULL,
      BALANCE INTEGER
    ) WITH (OIDS=FALSE)
    ;`
  executeQuery(query);
}

async function CriarTabelaStocks() {
  const query = `CREATE TABLE IF NOT EXISTS STOCKS (
        User_ID INTEGER REFERENCES USUARIO(ID),
        STOCK_ID INTEGER,
        AVG_PRICE INTEGER NOT NULL,  
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
        price INTEGER NOT NULL,
        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      ALTER TABLE TRANSACTIONS
          ALTER COLUMN stock_id SET DATA TYPE INTEGER  -- Update data type if necessary;
    `;
  executeQuery(query);
}

async function New_Transaction(user_id, stock_id, transaction_type, units, price, date) {
  const query = `
      INSERT INTO TRANSACTIONS (user_id, stock_id, transaction_type, units, price, timestamp)
      VALUES ($1, $2, $3, $4, $5, $6);
    `;
    // This is how many units were actually processed in the transaction
    let efective_units = await InsertStock(user_id, stock_id, units, price, transaction_type);
    if(efective_units){
      const values = [user_id, stock_id, transaction_type, efective_units, price, date];
      try {
        await executeQuery(query, values);
      } catch (error) {
        console.error('Error inserting transaction:', error);
      }
    }
}




async function SelectUsers() {
  const query = `select * from USUARIO;`;
  const result = await executeQuery(query);
  ////console.log(result);
  return result;
}

async function SelectStocks() {
  const query = `select * from stocks;`;
  const result = await executeQuery(query);
  //console.log(result);
}


async function GetUserTransactions(id) {
  const transactionsQuery = `
        SELECT id, stock_id, transaction_type, units, ROUND(price::numeric / 100, 2) AS price_in_Real, timestamp
        FROM transactions
        WHERE user_id = $1
        ORDER BY 
        timestamp ASC;;
      `;
  const transactionsResult = await executeQuery(transactionsQuery, [id]);
  return transactionsResult;
}


async function GetUserStocks(id) {
  const StocksQuery = `
        SELECT ROUND(avg_price::numeric / 100, 2) as avg_price_in_Real, stock_id, units
        FROM stocks
        WHERE user_id = $1;
      `;
  const StocksResult = await executeQuery(StocksQuery, [id]);
  StocksResult.forEach(x => {
    x.img_url = get_stock_img_by_id(x.stock_id);
    x.img_url = get_stock_img_by_id(x.stock_id);
    x.stock_name = get_stock_name_by_id(x.stock_id);
    x.stock_code = get_stock_code_by_id(x.stock_id);
  });
  return StocksResult;
}

async function Stocks_aggregated(id) {
  try {
    const query = `
    WITH aggregated_data AS (
      SELECT
          DATE_TRUNC('day', timestamp) AS date,
          stock_id,
          SUM(
              CASE
                  WHEN transaction_type = 'BUY' THEN units
                  WHEN transaction_type = 'SELL' THEN -units
                  ELSE 0
              END
          ) AS total_qtd
      FROM
          transactions
      WHERE
          user_id = $1
      GROUP BY
          date,
          stock_id
  )
  SELECT
      TO_CHAR(date, 'YYYY-MM-DD') AS date,
      json_agg(
          json_build_object(
              'stock_id', stock_id,
              'total_qtd', total_qtd
          )
      ) AS stocks
  FROM
      aggregated_data
  GROUP BY
      date
  ORDER BY
      date;`
    const Stocks_by_month = await executeQuery(query, [id]);
    if (Stocks_by_month.length === 0) {
      throw new Error('No Stocks found');
    }
    for (let i = 1; i < Stocks_by_month.length; i++) {
      Stocks_by_month[i - 1].stocks.map(a => Stocks_by_month[i].stocks.find(b => b.stock_id === a.stock_id) ? Stocks_by_month[i].stocks.map(b => b.stock_id === a.stock_id ? b.total_qtd = a.total_qtd + b.total_qtd : b.total_qtd) : Stocks_by_month[i].stocks.push(a));
      
      Stocks_by_month[i].stocks.map(a => a.total_qtd < 1 ? Stocks_by_month[i].stocks.splice(Stocks_by_month[i].stocks.indexOf(a), 1) : a);
      //Stocks_by_month[i].stocks[0].total_qtd += Stocks_by_month[i - 1].stocks[0].total_qtd;
    }

    //console.log(Stocks_by_month);

    //console.log("-------------------------------------------");
    return Stocks_by_month;
  } catch (error) {
    console.error("error " + error);
  }

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


    const StocksResult = await GetUserStocks(id);

    const transactionsResult = await GetUserTransactions(id);

    let stocks_infos_ids = [];

    for (const transaction of Object.values(transactionsResult)) {
      if (!stocks_infos_ids.includes(transaction.stock_id)) {
        stocks_infos_ids.push(transaction.stock_id);
      }
    }

    let stock_info = {};
    stocks_infos_ids.forEach(x => {
      stock_info[x] = {
        img_url: get_stock_img_by_id(x),
        stock_name: get_stock_name_by_id(x),
        stock_code: get_stock_code_by_id(x),
      }
    });

    const userWithTransactions = {
      id: user.id,
      name: user.name,
      stocks: StocksResult,
      transactions: transactionsResult,
      stocks_infos: stock_info
    };

    //console.log(userWithTransactions);
    return userWithTransactions;
  } catch (error) {
    console.error('Error selecting user with transactions:', error);
  }
}

async function Delete_User(nome) {

  const query = `DELETE FROM USUARIO WHERE NAME = '${nome}' RETURNING id;`;

  try {
    const result = await executeQuery(query);
    return result;
  } catch (error) {
    console.error('Error Deleting User user:', error);
  }
}


async function CriaUsuario(nome) {

  const query = `INSERT INTO USUARIO (NAME) VALUES ('${nome}') RETURNING id`;

  try {
    const result = await executeQuery(query);
    const userId = result;
    //console.log(userId);
    return userId;
  } catch (error) {
    console.error('Error creating user:', error);
  }
}



async function executeQuery(query, values) {
  //const pool = await pool.connect();
  try {
    await pool.query('BEGIN');
    const result = await pool.query(query, values);
    await pool.query('COMMIT');
    return result.rows;
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  }
}

async function InsertStock(userId, stockId, units, price, type) {
  try {
    const stock = await FindStock(userId, stockId);
    //console.log(userId);
    //console.log(stockId);

    if (stock) {
      return await updateStock(userId, stockId, units, price, type, stock);
    } 
    if(!stock && type == "BUY"){
      await createStock(userId, stockId, units, price);
      return units
    }

  } catch (error) {
    console.error('Error inserting stock:', error);
  }
}

async function FindStock(userId, stockId) {
  const query = `
    SELECT *
    FROM stocks
    WHERE user_id = $1
      AND stock_id = $2;
  `;
  const result = await executeQuery(query, [userId, stockId]);
  return result[0];
}

async function updateStock(userId, stockId, units, price, type, existingStock) {
  let newUnits;
  let newAvgPrice;

  if (type === 'BUY') {
    newUnits = existingStock.units + units;
    newAvgPrice = ((existingStock.units * existingStock.avg_price) + (units * price)) / newUnits;
  } else if (type === 'SELL') {
    newUnits = existingStock.units - units;
    newAvgPrice = ((existingStock.units * existingStock.avg_price) - (units * price)) / newUnits;
  }

  if (newUnits > 0) {
    const query = `
      UPDATE stocks
      SET units = $1, avg_price = $2
      WHERE user_id = $3 AND stock_id = $4;
    `;
    await executeQuery(query, [newUnits, newAvgPrice.toFixed(), userId, stockId]);
    return units;
  } else {
    await deleteStock(userId, stockId);
    return existingStock.units;
  }
}

async function createStock(userId, stockId, units, price) {

  if (price < 0) {
    throw new Error('Invalid price. Price cannot be negative.');
  }

  const query = `
    INSERT INTO stocks (user_id, stock_id, units, avg_price)
    VALUES ($1, $2, $3, $4);
  `;
  await executeQuery(query, [userId, stockId, units, price]);
}

async function deleteStock(userId, stockId) {
  const query = `
    DELETE FROM stocks
    WHERE user_id = $1 AND stock_id = $2;
  `;
  await executeQuery(query, [userId, stockId]);
}




module.exports = { inicializarDb, SelectUser, Delete_User, SelectUsers, CriaUsuario, New_Transaction, Stocks_aggregated};


