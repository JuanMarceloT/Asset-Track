import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Selectable_menu from './components/Selectable_menu';

import Info_Card from './components/Info_Card';

import Graph from './components/graph';
import { GetUser, Create_New_Transaction, createNewUser, Get_Graph_Params} from './bff.js';

import Dashboard_Section from './Dashboard_Section';
import Top_Cards from './components/Top_Cards';
import Top_Menu from './components/Top_Menu';

function App() {
  const id = 92;

  const [Username,setusername] = useState(null);
  const [stocks, setstocks] = useState(null);
  const [transactions, settransacitons] = useState(null);
  const [updateFlag, setUpdateFlag] = useState(0);
  const [StocksLoading, SetStocksLoading] = useState(0);
  const [graph, setGraph] = useState({});
  const [Invested, setInvested] = useState(0); 
  const [variation, setVariation] = useState(0);


  function HandleNewTransaction (args) {
    Create_New_Transaction(args);
    setUpdateFlag(1);
  };

  function GetInvestedValues(graph){
    let this_month = graph[graph.length - 1].assets_value;
    console.log("oasd");
    console.log(graph);
    setInvested(this_month);
  }

  function GetVariation(graph){
    let this_month = graph[graph.length - 1].assets_value;
    let last_month = graph[graph.length - 2].assets_value;
    setVariation(this_month - last_month);
  }

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
      ////console.log(transactions);
      ////console.log(stocks);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const updateGraph = async () => {
    try {
      const data = await Get_Graph_Params(id);
      setGraph(data);
      //console.log(data);
      GetInvestedValues(data);
      GetVariation(data);
      
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
      <Top_Menu/>
      <Top_Cards>
        <Info_Card content={{title: "Investido", content:`R$ ${Invested}`, subcontent:"+20% comparado ao ultimo mes"}}/>
        <Info_Card content={{title: "Variação", content:`R$ ${variation}`, subcontent:"+20% comparado ao ultimo mes"}}/>
        <Info_Card content={{title: "Dividendos deste ano", content:"R$240,87", subcontent:"+20% comparado ao ultimo ano"}}/>
      </Top_Cards>
      <Dashboard_Section>
        <Graph Params={graph} />
        <Selectable_menu id={id} HandleNewTransaction={HandleNewTransaction} stocks={stocks}/>
      </Dashboard_Section>
    </React.StrictMode>
  );
  }

ReactDOM.render(<App />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(//console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
