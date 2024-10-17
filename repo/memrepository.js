const { get_stock_name_by_id, get_stock_img_by_id, get_stock_code_by_id } = require('../utils/stocks_hash_map.js');

let users = new Map(); // A map to store users by ID

const CriaUsuario = name => {
  const userId = parseInt(Date.now() * Math.random()); // unique ID
  users.set(userId, {
    id: userId,
    name: name ?? " ",
    balance: 0,
    stocks: [],
    transactions: [],
    
  });
  return [{ id: userId }];
};

const inicializarDb = () => {
  users.clear();
};

const deleteUser = userId => {
  users.delete(+userId);
};

function New_Transaction(
  userId,
  stockId,
  transactionType,
  units,
  price,
  timestamp
) {
  const user = users.get(+userId);
  if (!user) return; // User does not exist

  let efective_units = units;
  let stock = user.stocks.find(x => x.stock_id === stockId);

  let date = new Date(timestamp);

  if (date > new Date()) {
    return;
  }

  if (!price) {
    return;
  }

  if (stock) {
    if (transactionType === 'BUY') {
      stock.avg_price_in_real =
        ((stock.avg_price_in_real * stock.units * 100) +
          (price * units)) /
        (stock.units + units);
      stock.units += units;
    } else if (transactionType === 'SELL') {
      stock.avg_price_in_real =
        ((stock.avg_price_in_real * stock.units * 100) -
          (price * units)) /
        (stock.units - units);
      stock.units -= units;
      if (stock.units <= 0) {
        efective_units = efective_units + stock.units;
        const stockIndex = user.stocks.findIndex(stock => stock.stock_id === stockId);

        if (stockIndex !== -1) {
          user.stocks.splice(stockIndex, 1);
        }
      }
    }

    stock.avg_price_in_real = (stock.avg_price_in_real / 100).toFixed(2);

  } else {
    user.stocks.push({
      user_id: userId,
      avg_price_in_real: price / 100,
      stock_id: stockId,
      units: units,
      img_url: get_stock_img_by_id(stockId),
      stock_name: get_stock_name_by_id(stockId),
      stock_code: get_stock_code_by_id(stockId),
    });
  }

  user.transactions.push({
    userId,
    stock_id: stockId,
    transaction_type: transactionType,
    units: efective_units,
    price_in_real: price / 100,
    timestamp,
  });
}

const Stocks_aggregated = userId => {
  const user = users.get(+userId);
  if (!user) return []; // User does not exist

  let result = [];
  let stockState = new Map(); // To keep track of stock quantities globally

  // Fetch user transactions
  const transactions = user.transactions;

  transactions.forEach(transaction => {
    let date = new Date(transaction.timestamp);
    let formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    // Update stock quantities based on the current transaction
    const currentUnits = stockState.get(transaction.stock_id) || 0;

    if (transaction.transaction_type === "BUY") {
      stockState.set(transaction.stock_id, currentUnits + transaction.units);
    } else if (transaction.transaction_type === "SELL") {
      const updatedUnits = currentUnits - transaction.units;
      if (updatedUnits <= 0) {
        stockState.delete(transaction.stock_id);
      } else {
        stockState.set(transaction.stock_id, updatedUnits);
      }
    }

    // Create the stock array for the current date based on the global stock state
    let stocks = Array.from(stockState, ([stock_id, total_qtd]) => ({ stock_id, total_qtd }));

    if (result.length > 0 && result[result.length - 1].date === formattedDate) {
      result[result.length - 1].stocks = stocks;
    } else {
      result.push({
        date: formattedDate,
        stocks: stocks
      });
    }

  });

  return result;
};

const SelectUser = userId => {
  const user = users.get(+userId);
  if (!user) return null; // User does not exist

  let stock_info = {};
  user.stocks.forEach(stock => {
    stock_info[stock.stock_id] = {
      img_url: stock.img_url,
      stock_name: stock.stock_name,
      stock_code: stock.stock_code,
    };
  });

  return {
    id: userId,
    name: user.name,
    stocks: user.stocks,
    transactions: user.transactions,
    stocks_infos: stock_info,
  };
};

const SelectUsers = () => {
  return Array.from(users.values());
};

const Delete_User = userId => {
  deleteUser(+userId);
};

module.exports = { inicializarDb, SelectUser, Delete_User, SelectUsers, CriaUsuario, New_Transaction, Stocks_aggregated };
