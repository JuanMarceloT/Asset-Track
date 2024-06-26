
const { type } = require('os');
const pool = require('./db');
const { get } = require('https');
const { promises } = require('dns');
const { get_stock_name_by_id } = require('../View/src/bff');



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
    //console.log(ex);
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
        User_ID INTEGER REFERENCES USUARIO(ID),
        STOCK_ID INTEGER,
        STOCK_NAME VARCHAR(255),
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

async function Nova_Tranasção(user_id, stock_id, transaction_type, units, price, date) {
  const query = `
      INSERT INTO TRANSACTIONS (user_id, stock_id, transaction_type, units, price, timestamp)
      VALUES ($1, $2, $3, $4, $5, $6);
    `;
  const values = [user_id, stock_id, transaction_type, units, price, date];
  await InsertStock(user_id, stock_id, units, price, transaction_type);


  try {
    await executeQuery(query, values);
    ////console.log('Transaction inserted successfully.');
  } catch (error) {
    console.error('Error inserting transaction:', error);
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
        SELECT ROUND(avg_price::numeric / 100, 2) as avg_price_in_Real, stock_id, stock_name, units
        FROM stocks
        WHERE user_id = $1;
      `;
  const user_id = [id];
  const StocksResult = await executeQuery(StocksQuery, [93]);
  console.log(StocksResult);
  return StocksResult;
}

async function Stocks_aggregated_by_month(id) {
  try {
    const query = `
    WITH aggregated_data AS (
      SELECT
          EXTRACT(YEAR FROM timestamp) AS year,
          EXTRACT(MONTH FROM timestamp) AS month,
          stock_id,
          SUM(CASE WHEN transaction_type = 'BUY' THEN units WHEN transaction_type = 'SELL' THEN -units ELSE 0 END) AS total_qtd
      FROM
          transactions
      WHERE
          user_id = $1
      GROUP BY
          EXTRACT(YEAR FROM timestamp),
          EXTRACT(MONTH FROM timestamp),
          stock_id
  )
  SELECT
      year,
      month,
      json_agg(
          json_build_object(
              'stock_id', stock_id,
              'total_qtd', total_qtd
          )
      ) AS stocks
  FROM
      aggregated_data
  GROUP BY
      year,
      month
  ORDER BY
      year,
      month;
  
    `;
    const Stocks_by_month = await executeQuery(query, [id]);
    if (Stocks_by_month.length === 0) {
      throw new Error('User not found');
    }
    //console.log(`${Stocks_by_month[0].year}-${Stocks_by_month[0].month}`);
    //console.log(Stocks_by_month[0].stocks[0]);
    for (let i = 1; i < Stocks_by_month.length; i++) {
      //console.log(`${Stocks_by_month[i].year}-${Stocks_by_month[i].month}`);
      Stocks_by_month[i].stocks[0].total_qtd += Stocks_by_month[i - 1].stocks[0].total_qtd;
      //console.log(Stocks_by_month[i].stocks[0]);
      if (Stocks_by_month[i].stocks[1]) {
        //console.log(Stocks_by_month[i].stocks[1]);
      }
    }

    //console.log("-------------------------------------------");
    return Stocks_by_month;
  } catch (error) {
    console.error("error " + error);
  }

}


async function getMonthlyAsset(user_id) {
  const assetByMonth = [];

  try {
    const stocksByMonth = await Stocks_aggregated_by_month(user_id);
    const monthsSince = getLastWeekdaysSince(stocksByMonth[0].month, stocksByMonth[0].year);
    let currentIndex = 0;

    for (const month of monthsSince) {
      currentIndex = findLastTransactionIndex(stocksByMonth, currentIndex, month);
      const assetsValue = await calculateAssetsValue(stocksByMonth[currentIndex].stocks, month);

      assetByMonth.push({
        year: month.getFullYear(),
        month: month.getMonth() + 1,
        assets_value: assetsValue
      });
    }

    return assetByMonth;
  } catch (error) {
    console.error("Error:", error);
  }
}

function findLastTransactionIndex(stocksByMonth, currentIndex, month) {
  while (stocksByMonth[currentIndex + 1] &&
    stocksByMonth[currentIndex + 1].year <= month.getFullYear() &&
    stocksByMonth[currentIndex + 1].month <= (month.getMonth() + 1)) {
    currentIndex++;
  }
  return currentIndex;
}

async function calculateAssetsValue(stocks, month) {
  let totalValue = 0;

  for (const stock of stocks) {
    let assetPrice = await get_stock_close_price(Get_Stock_Code(stock.stock_id), month);
    while (assetPrice === 0 || typeof assetPrice !== 'number') {
      month.setDate(month.getDate() - 1);
      assetPrice = await get_stock_close_price(Get_Stock_Code(stock.stock_id), month);
    }

    totalValue += assetPrice * stock.total_qtd;
  }
  return totalValue;
}



async function get_User_monthly_dividends(user_id) {
  const DividendsByMonth = [];

  try {
    const stocksByMonth = await Stocks_aggregated_by_month(user_id);
    const monthsSince = getLastWeekdaysSince(stocksByMonth[0].month, stocksByMonth[0].year);
    let currentIndex = 0;

    for (const month of monthsSince) {
      currentIndex = findLastTransactionIndex(stocksByMonth, currentIndex, month);
      const Dividends = await calculateDividendsInMonth(stocksByMonth[currentIndex].stocks, month);

      DividendsByMonth.push({
        year: month.getFullYear(),
        month: month.getMonth() + 1,
        Dividends: Dividends
        /*{
          total_Dividends: 200,
          stocks: {
            ITUB4: {
              dividends_per_share: 12,
              total_Dividends: 100,
            },
            PETR4: {
              dividends_per_share: 12,
              total_Dividends: 100,
            }
          }
        }



        */
      });
    }
    //console.log(DividendsByMonth);
    return DividendsByMonth;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function calculateDividendsInMonth(stocks, month) {
  let Dividends = {};
  let total_Dividends = 0;

  for (const stock of stocks) {
    let stock_dividends_in_month = await get_stock_dividends_in_month(Get_Stock_Code(stock.stock_id), month);
    let stock_dividends = 0;
    //console.log(stock_dividends_in_month);
    for (const [date, dividend] of Object.entries(stock_dividends_in_month)) {
      stock_dividends += dividend;
    }
    Dividends[stock.stock_id] = {
      dividends_per_share: stock_dividends,
      total_Dividends: stock_dividends * stock.total_qtd,
    };

    total_Dividends += stock_dividends * stock.total_qtd;
  }
  return {
    "total_Dividends":total_Dividends,
    "stock_dividends":Dividends
  };
}

async function get_stock_dividends_in_month(stock_code, month) {
  //console.log(stock_code);
   if(stock_code == "PETR4"){
     return {
       "2020-01-01": 20.48,
       "2020-01-02": 1.48,
     };
   }
   return {
     "2020-01-01": 0.48,
     "2020-01-02": 0.48,
   };
  try {
    const response = await fetch(`http://127.0.0.1:5000/dividends/${stock_code}.SA/${month.getFullYear()}-${month.getMonth() + 1}`);
    //console.log(date);
    if (!response.ok) {
      return undefined;
    }
    const data = await response.json();

    return data[0] ?? 0;

  } catch (error) {
    console.error('Error:', error);
  }
}

function Get_Stock_Code(stock_id) {
  if(stock_id == 1){
    return "ITUB4";
  }

  return "PETR4";
}

async function get_stock_close_price(stockName, date) {
return 1;
  try {
    const response = await fetch(`http://127.0.0.1:5000/stock/${stockName}.SA/${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}`);
    //console.log(date);
    if (!response.ok) {
      return undefined;
    }
    const data = await response.json();

    return data[0]?.Close ?? 0;

  } catch (error) {
    console.error('Error:', error);
  }

}


function getLastWeekdaysSince(month, year) {
  let startDate = new Date(year, month - 1);
  let currentDate = new Date();
  let result = [];

  while (startDate <= currentDate) {
    let lastDay = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    while (lastDay.getDay() === 0 || lastDay.getDay() === 6) {
      lastDay.setDate(lastDay.getDate() - 1);
    }
    if (lastDay < currentDate) {
      result.push(new Date(lastDay));
    } else {
      result.push(currentDate);
    }

    startDate.setMonth(startDate.getMonth() + 1);
  }

  return result;
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


    const userWithTransactions = {
      id: user.id,
      name: user.name,
      stocks: StocksResult,
      transactions: transactionsResult
    };

    ////console.log(userWithTransactions);
    return userWithTransactions;
  } catch (error) {
    console.error('Error selecting user with transactions:', error);
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

function formatDate(year, month, day) {
  const formattedMonth = String(month).padStart(2, '0');
  const formattedDay = String(day).padStart(2, '0');

  const date = new Date(year, month - 1, day); // Month is zero-based 

  //'YYYY-MM-DD'
  const formattedDate = `${date.getFullYear()}-${formattedMonth}-${formattedDay}`;

  return formattedDate;
}

async function InsertStock(userId, stockId, units, price, type) {
  try {
    const stock = await FindStock(userId, stockId);
    console.log(userId);
    console.log(stockId);

    if (stock) {
      await updateStock(userId, stockId, units, price, type, stock);
    } else {
      await createStock(userId, stockId, units, price);
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
  } else {
    await deleteStock(userId, stockId);
  }
}

async function createStock(userId, stockId, units, price) {
  const query = `
    INSERT INTO stocks (user_id, stock_id, STOCK_NAME, units, avg_price)
    VALUES ($1, $2, $3, $4, $5);
  `;
  await executeQuery(query, [userId, stockId, get_stock_name_by_id(stockId), units, price]);
}

async function deleteStock(userId, stockId) {
  const query = `
    DELETE FROM stocks
    WHERE user_id = $1 AND stock_id = $2;
  `;
  await executeQuery(query, [userId, stockId]);
}




module.exports = { inicializarDb, SelectUser, SelectUsers, CriaUsuario, Nova_Tranasção, formatDate, getMonthlyAsset, get_stock_close_price, get_User_monthly_dividends};