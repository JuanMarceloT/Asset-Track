
const { type } = require('os');
const pool = require('./db');
const { get } = require('https');
const { promises } = require('dns');



async function inicializarDb(){
    try {
      await pool.connect();
      //console.log('Connected to PostgreSQL database!');
  
      //DeleteAllTables();
      await CriarTabelaUsuarios();
      await CriarTabelaStocks();
      await CriarTabelaTransaçõess();
      await CriaUsuario("Juan");
      //const res = await pool.query(query);
      //const users = res.rows; // Array of objects containing retrieved data
    }catch(ex){
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
    await InsertStock(user_id,stock_id, units, price, transaction_type);

  
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


  async function GetUserTransactions(id){
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


  async function GetUserStocks(id){
    const StocksQuery = `
        SELECT ROUND(avg_price::numeric / 100, 2) as avg_price_in_Real, stock_id, stock_name, units
        FROM stocks
        WHERE user_id = $1;
      `;
      const StocksValues = [id];
      const StocksResult = await executeQuery(StocksQuery, StocksValues);
      return StocksResult;
  }

/*
  async function GetMontlyAsset(id) {
    const assetByMonth = {};
    try {
      const transactionsResult = await GetUserTransactions(id);
      transactionsResult.forEach(transaction => {
            const date = new Date(transaction.timestamp);
            const monthYear = `${date.getFullYear()}-${date.getMonth()}`;
            if (!assetByMonth[monthYear]) {
                assetByMonth[monthYear] = {
                    monthYear,
                    assets: {}
                };
            }
            if (!assetByMonth[monthYear].assets[transaction.stock_id]) {
              assetByMonth[monthYear].assets[transaction.stock_id] = { stock_id: transaction.stock_id, qtd: 0 };
            }
            if (transaction.transaction_type === 'BUY') {
              assetByMonth[monthYear].assets[transaction.stock_id].qtd += transaction.units;
            } else {
                assetByMonth[monthYear].assets[transaction.stock_id].qtd -= transaction.units;
            }
            ////console.log(assetByMonth[monthYear].assets[transaction.stock_id]);
            ////console.log(monthYear);
        });
        return assetByMonth;
    } catch (error) {
        console.error("error " + error);
    }
}
*/
async function GetMontlyAsset(id) {
  const assetByMonth = {};
  const promises = [];
  
  try {
    const transactionsResult = await GetUserTransactions(id);

    for (let i = 0; i < transactionsResult.length - 1; i++) {
      const transaction = transactionsResult[i];
      const nextIndex = i + 1;
      let current_date = new Date(transaction.timestamp);

      const monthYear = `${current_date.getFullYear()}-${current_date.getMonth()}`;

      console.log(transaction);

      if (!assetByMonth[monthYear]) {
        assetByMonth[monthYear] = {
          monthYear,
          assets: {}
        };
      }

      if (!assetByMonth[monthYear].assets[transaction.stock_id]) {
        let year_month_day = `${current_date.getFullYear()}-${current_date.getMonth() + 1}-${current_date.getDay()}`;
        console.log(year_month_day);
        let stock;

        switch(transaction.stock_id){
            case 2:
                stock = "VALE3";
                break;
            case 1:
                stock = "PETR4";
                break;
            default:
                stock = "CASH3";
                break;
        }



        const pricePromise = await get_stock_close_price(stock, year_month_day);

        assetByMonth[monthYear].assets[transaction.stock_id] = { stock_id: transaction.stock_id, qtd: 0, price: pricePromise };
      }

      if (transaction.transaction_type === 'BUY') {
        assetByMonth[monthYear].assets[transaction.stock_id].qtd += transaction.units;
      } else {
        assetByMonth[monthYear].assets[transaction.stock_id].qtd -= transaction.units;
      }

      while (getNextMonth(current_date) < new Date(transactionsResult[nextIndex].timestamp)) {
        current_date = getNextMonth(current_date);
        const monthYear = `${current_date.getFullYear()}-${current_date.getMonth()}`;
        if (!assetByMonth[monthYear]) {
          assetByMonth[monthYear] = {
            monthYear,
            assets: {}
          };
        }
      }
    }


    return assetByMonth;
  } catch (error) {
    console.error("error " + error);
  }
}

async function get_stock_close_price(stockName, date){
  try {
    const response = await fetch(`http://127.0.0.1:5000/stock/${stockName}.SA/${date}`);
    if (!response.ok) {
      return undefined;
    }
    const data = await response.json();

    return data[0]?.Close ?? 0; 
    
} catch (error) {
    console.error('Error:', error);
}

}

function getNextMonth(date){
  if (date.getMonth() == 11) {
    var new_date = new Date(date.getFullYear() + 1, 0, 1);
  } else {
      var new_date = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  }

  return new_date;
}


async function Consolidação(){

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
  
  
    // Prepared statement to prevent SQL injection vulnerabilities
    const query = `INSERT INTO USUARIO (NAME) VALUES ('${nome}') RETURNING id`;
  
    try {
      const result = await executeQuery(query);
      const userId = result; // Assuming 'id' is the returned column name
      //console.log(userId);
      return userId;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error; // Re-throw the error to propagate it if needed
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
      ////console.log(CheckStock[0].units);
  
      if (CheckStock.length > 0) {
        const updateQuery = `
          UPDATE stocks
          SET units = $1, avg_price = $2
          WHERE user_id = $3 AND stock_id = $4
          RETURNING *;
        `;
        let new_avg_price = CheckStock[0].avg_price;
        if(TYPE == 'BUY'){
          new_avg_price = ((CheckStock[0].units * CheckStock[0].avg_price) + (units * price)) / (CheckStock[0].units + units);
          const updateResult = await executeQuery(updateQuery, [(CheckStock[0].units + units), new_avg_price.toFixed(), user_id, stock_id]); // esse to fixed é gambiarra
        }
        if(TYPE == 'SELL'){
          new_avg_price = ((CheckStock[0].units * CheckStock[0].avg_price) - (units * price)) / (CheckStock[0].units - units);
          let FInalUnits = (CheckStock[0].units - units);
          if(FInalUnits > 0){
            const updateResult = await executeQuery(updateQuery, [FInalUnits, new_avg_price.toFixed(), user_id, stock_id]); // esse to fixed é gambiarra
          }else{
            const REMOVE_STOCK = `DELETE FROM stocks
            WHERE user_id = $1 AND stock_id = $2
            RETURNING *;
            `;
            const updateResult = await executeQuery(REMOVE_STOCK, [user_id, stock_id]);
          }
        }
      } else {
         const createStockQuery = `
          INSERT INTO stocks (user_id, stock_id, STOCK_NAME, units, avg_price)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
        `;
        const createStockValues = await executeQuery(createStockQuery, [user_id, stock_id, GetStockNameByID(stock_id), units, price]);
  
      }
    } catch (error){
      console.error('Error Inserting stock:', error);
     }
  
  }


  
module.exports = { inicializarDb, SelectUser, SelectUsers, CriaUsuario, Nova_Tranasção, formatDate, GetMontlyAsset, get_stock_close_price};