let users = [];
let stocks = [];
let transactions = [];

const CriaUsuario = name => {
  const id = users.length ? users[users.length - 1].id + 1 : 1;
  const newUser = { id, name, balance: 0 };
  users.push(newUser);
  return newUser;
};
const inicializarDb = () => {};

const deleteUser = name => {
  users = users.filter(user => user.name !== name);
};


function New_Transaction(
  userId,
  stockId,
  transactionType,
  units,
  price,
  timestamp
) {

    let efective_units = units;
  if (stocks[stockId]) {
    if (transactionType == 'BUY') {
      stocks[stockId].avg_price_in_real =
        (stocks[stockId].avg_price_in_real * stocks[stockId].units +
          price * units) /
        (stocks[stockId].units + units);
      stocks[stockId].units += units;
    }
    if (transactionType == 'SELL') {
      stocks[stockId].avg_price_in_real =
        (stocks[stockId].avg_price_in_real * stocks[stockId].units -
          price * units) /
        (stocks[stockId].units - units);
      stocks[stockId].units -= units;
      if (stocks[stockId].units <= 0) {
          efective_units = efective_units + stocks[stockId].units;
        stocks[stockId] = null;
      }
    }
  } else {
    stocks[stockId] = {
      userId: userId,
      avg_price_in_real: price,
      stock_id: stockId,
      units: units,
      img_url:'https://yt3.googleusercontent.com/cxDKS7OTT2SB4CNFHlrAvCDivGJR70H8ne8607esi9q6ALGQClYZPa03qcAR0ynhCtYS5JNMBA=s900-c-k-c0x00ffffff-no-rj',
      stock_name: 'MELIUZ',
      stock_code: 'CASH3',
    };
  }

  transactions.push({
    userId,
    stockId,
    transactionType,
    efective_units,
    price,
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
        if (transaction.transactionType === "BUY") {
            stockState.set(transaction.stockId, (stockState.get(transaction.stockId) || 0) + transaction.efective_units);
        } else if (transaction.transactionType === "SELL") {
            stockState.set(transaction.stockId, (stockState.get(transaction.stockId) || 0) - transaction.efective_units);
        }

        // Create the stock array for the current date based on the global stock state
        let stocks = Array.from(stockState, ([stock_id, total_qtd]) => ({ stock_id, total_qtd }));

        result.push({
            date: formattedDate,
            stocks: stocks
        });
    });

    return result;
};


const GetUserTransactions = id => {
  return transactions.filter(transaction => transaction.userId === id);
};

const GetUserStocks = id => {
  return stocks.filter(stock => stock && stock.userId === id);
};

const SelectUser = id => {
  const StocksResult = GetUserStocks(id);

  const transactionsResult = GetUserTransactions(id);

  let stock_info = {};
  stock_info[1] = {
    img_url:
      'https://yt3.googleusercontent.com/cxDKS7OTT2SB4CNFHlrAvCDivGJR70H8ne8607esi9q6ALGQClYZPa03qcAR0ynhCtYS5JNMBA=s900-c-k-c0x00ffffff-no-rj',
    stock_name: 'MELIUZ',
    stock_code: 'CASH3',
  };

  const userWithTransactions = {
    id: id,
    name: 'juan',
    stocks: StocksResult,
    transactions: transactionsResult,
    stocks_infos: stock_info,
  };
  return userWithTransactions;
};

const SelectUsers = () => {
  return users;
};

const Delete_User = () => {
  users = [];
  stocks = [];
  transactions = [];
};

let id = CriaUsuario('Juan').id;

New_Transaction(id, 1, 'BUY', 10, 10, new Date("04/10/2019"));
New_Transaction(id, 5, 'BUY', 50, 10, new Date("01/2/2020"));
New_Transaction(id, 1, 'BUY', 50, 10, new Date("06/4/2021"));
Stocks_aggregated(id);
// console.log(SelectUser(id));
// console.log(Stocks_aggregated(id));
// Stocks_aggregated(id).forEach(x => console.log(x.stocks))