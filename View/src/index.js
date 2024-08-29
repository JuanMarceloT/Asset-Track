import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Selectable_menu from './components/side_menu/Selectable_menu';
import Info_Card from './components/cards/Info_Card';
import './index.css';
import Graph from './components/graph/graph';
import { GetUser, Create_New_Transaction, createNewUser, Get_Graph_Params, Get_Dividends, get_ytd_dividends} from './bff.js';

import Dashboard_Section from './Dashboard_Section';
import Top_Menu from './components/top_menu/Top_Menu';

function App() {
  const id = 7;

  const [Username,setusername] = useState(null);
  const [stocks, setstocks] = useState(null);
  const [transactions, settransacitons] = useState(null);
  const [Invested, setInvested] = useState(0); 
  const [Dividends, setDividends] = useState(0);
  const [Dividends_ytd, setDividends_ytd] = useState(0);


  function HandleNewTransaction (args) {
    Create_New_Transaction(args);
  };

  function GetInvestedValues(graph){
    setInvested(0);
  }

  const Inicializer = async () => {
    try {
      const data = await GetUser(id);
      setusername(data.name);
      setstocks(data.stocks);
      settransacitons(data.transactions);
      let dividend = await Get_Dividends(id);
      setDividends(dividend);
      setDividends_ytd(get_ytd_dividends(dividend));
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
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    Inicializer().then((user) => {
      console.log(user);
    });
  }, []);

  return (
    <React.StrictMode>
      <Top_Menu/>
      <Dashboard_Section>
        <Info_Card content={{title: "Investido", content:`R$ ${Invested.toFixed(2)}`, subcontent:"+12% this month"}}/>
        <Info_Card content={{title: "Dividendos deste ano", content:`R$ ${Dividends_ytd.toFixed(2)}`, subcontent:"+8% this year"}}/>
        <Selectable_menu id={id} HandleNewTransaction={HandleNewTransaction} stocks={stocks} transactions={transactions} Dividends={Dividends}/>
        <Graph user_id={id}/>
      </Dashboard_Section>
    </React.StrictMode>
  );
  }

ReactDOM.render(<App />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(//console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
