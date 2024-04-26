import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import MID_SECTION from './Mid_Section';
import StockInput from './Stock_input';
import { GetUser, Create_New_Transaction, createNewUser} from './bff.js';
import TransactionCard from './TransactionCard';
import StocksCard from './StocksCard';
import ScrollableDivs from './ScrollableDivs';

function App() {
  const id = 39;

  const [Username,setusername] = useState(null);
  const [stocks, setstocks] = useState(null);
  const [transactions, settransacitons] = useState(null);
  const [updateFlag, setUpdateFlag] = useState(0);
  const [StocksLoading, SetStocksLoading] = useState(0);

  function HandleNewTransaction (args) {
    Create_New_Transaction(args);
    setUpdateFlag(1);
  };

  const Inicializer = async () => {
    try {
      const data = await GetUser(id);
      setusername(data.name);
      setstocks(data.stocks);
      settransacitons(data.transactions);
      return data;
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  
  const updateTransactionsAndStocks = async () => {
    try {
      const data = await GetUser(id);
      setstocks(data.stocks);
      settransacitons(data.transactions);
      //console.log(transactions);
      //console.log(stocks);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    Inicializer().then((user) => {
      console.log(user);
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (updateFlag === 1) {
          SetStocksLoading(true);
          try {
              await updateTransactionsAndStocks();
              SetStocksLoading(false);
              setUpdateFlag(0);
          } catch (error) {
              console.error('Failed to update transactions and stocks:', error);
              SetStocksLoading(false);
          }
      }else{  //gambiarra da braba, pq ele não tava esperando o updatetransactions terminar e acabava que só atualizava na proxima chamada
        try {
            await updateTransactionsAndStocks();
          } catch (error) {
              console.error('Failed to update transactions and stocks:', error);
          }
      }
  };

  fetchData();
  }, [updateFlag]);
  




  return (
    <React.StrictMode>
      <MID_SECTION data={id} />
      <StockInput user_id={id} HandleNewTransaction={HandleNewTransaction}/>
      <ScrollableDivs maxHeight={200}>
        <TransactionCard transactions={transactions}/>
      </ScrollableDivs>
      <StocksCard stocks={stocks}/>
    </React.StrictMode>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
