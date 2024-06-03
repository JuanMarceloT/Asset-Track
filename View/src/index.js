import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import MID_SECTION from './Mid_Section';
import StockInput from './components/Stock_input';
import { GetUser, Create_New_Transaction, createNewUser, Get_Graph_Params} from './bff.js';
import TransactionCard from './components/TransactionCard';
import StocksCard from './components/StocksCard';
import ScrollableDivs from './components/ScrollableDivs';
import Graph from './components/graph';

import Dashboard_Section from './Dashboard_Section';
import New_Transaciton_button from './components/New_Transaction_button';

function App() {
  const id = 26;

  const [Username,setusername] = useState(null);
  const [stocks, setstocks] = useState(null);
  const [transactions, settransacitons] = useState(null);
  const [updateFlag, setUpdateFlag] = useState(0);
  const [StocksLoading, SetStocksLoading] = useState(0);
  const [graph, setGraph] = useState({});

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
      updateGraph();
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

  const updateGraph = async () => {
    try {
      const data = await Get_Graph_Params(id);
      setGraph(data);
      console.log(data);
      
    } catch (error) {
      console.error("Error fetching graph:", error);
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
              await updateGraph();
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
      <MID_SECTION>
      <Dashboard_Section graph={graph} stocks={stocks}/>
      </MID_SECTION>
      <StockInput user_id={id} HandleNewTransaction={HandleNewTransaction}/>
    </React.StrictMode>
  );
  /*<Graph Params={graph}/>
  <ScrollableDivs maxHeight={50}>
    <StocksCard stocks={stocks}/>
  </ScrollableDivs>
  <New_Transaciton_button/>
      <ScrollableDivs maxHeight={30}>
        <TransactionCard transactions={transactions}/>
        </ScrollableDivs>
  
        */
  }

ReactDOM.render(<App />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
