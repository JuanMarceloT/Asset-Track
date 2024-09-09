
const { get_stock_name_by_id, get_stock_img_by_id, get_stock_code_by_id } = require('../utils/stocks_hash_map.js');

let user = [];
let stocks = [];
let transactions = [];

const CriaUsuario = name => {
  user = { id: 1, name: name ?? " ", balance: 0 };
  stocks = [];
  transactions = [];
  return [{ id: 1 }];
};
const inicializarDb = () => { };

const deleteUser = name => {
  user = [];
};


function New_Transaction(
  userId,
  stockId,
  transactionType,
  units,
  price,
  timestamp
) {
  // console.log(transactions);
  let efective_units = units;
  let stock = stocks.find(x => x.stock_id == stockId);

  let date = new Date(timestamp);

  if (date > new Date()) {
    return;
  }

  if (!price) {
    return;
  }

  if (stock) {

    // It's multiplied by 100 to perform all calculations in cents, and then converted back to reais.
    if (transactionType == 'BUY') {
      stock.avg_price_in_real =
        ((stock.avg_price_in_real * stock.units * 100) +
          (price * units)) /
        (stock.units + units);
      stock.units += units;
    }
    if (transactionType == 'SELL') {
      stock.avg_price_in_real =
        ((stock.avg_price_in_real * stock.units * 100) -
          (price * units)) /
        (stock.units - units);
      stock.units -= units;
      if (stock.units <= 0) {
        efective_units = efective_units + stock.units;
        const stockIndex = stocks.findIndex(stock => stock.stock_id === stockId);

        if (stockIndex !== -1) {
          stocks.splice(stockIndex, 1);
        }
      }
    }

    stock.avg_price_in_real = (stock.avg_price_in_real / 100).toFixed(2);

  } else {
    stocks.push({
      user_id: userId,
      avg_price_in_real: price / 100,
      stock_id: stockId,
      units: units,
      img_url: get_stock_img_by_id(stockId),
      stock_name: get_stock_name_by_id(stockId),
      stock_code: get_stock_code_by_id(stockId),
    });
  }

  transactions.push({
    userId,
    stock_id: stockId,
    transaction_type: transactionType,
    units: efective_units,
    price_in_real: price / 100,
    timestamp,
  });

}
const Stocks_aggregated = id => {
  let result = [];
  let stockState = new Map(); // To keep track of stock quantities globally

  // Fetch user transactions
  const transactions = GetUserTransactions(id);

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

    if (result.length > 0 && result[result.length - 1].date == formattedDate) {
      result[result.length - 1].stocks = stocks;
    } else {
      result.push({
        date: formattedDate,
        stocks: stocks
      });
    }

  });


  // result.forEach(x => {
  //   console.log(x.date);
  //   console.log(x.stocks);
  // })
  return result;
};


const GetUserTransactions = id => {
  return transactions;
};

const GetUserStocks = id => {
  return stocks;
};

const SelectUser = id => {


  let stock_info = {};
  stock_info[1] = {
    img_url:
      'https://yt3.googleusercontent.com/cxDKS7OTT2SB4CNFHlrAvCDivGJR70H8ne8607esi9q6ALGQClYZPa03qcAR0ynhCtYS5JNMBA=s900-c-k-c0x00ffffff-no-rj',
    stock_name: 'MELIUZ',
    stock_code: 'CASH3',
  };


  const userWithTransactions = {
    id: id,
    name: user.name ?? "",
    stocks: stocks,
    transactions: transactions,
    stocks_infos: stock_info,
  };

  // console.log(stocks);

  console.log(userWithTransactions);
  return userWithTransactions;
};

const SelectUsers = () => {
  return user;
};

const Delete_User = () => {
  user = [];
  stocks = [];
  transactions = [];
};



module.exports = { inicializarDb, SelectUser, Delete_User, SelectUsers, CriaUsuario, New_Transaction, Stocks_aggregated };

// Stocks_aggregated(id);
// console.log(SelectUser(id));
// console.log(Stocks_aggregated(id));
// Stocks_aggregated(id).forEach(x => console.log(x.stocks))