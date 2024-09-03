import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Side_menu from './components/side_menu/Side_menu';
import './index.css';
import Graph from './components/graph/graph';
import { GetUser, Create_New_Transaction, createNewUser, Get_Graph_Params, Get_Dividends, get_ytd_dividends} from './bff.js';

import Dashboard_Section from './Dashboard_Section';
import Top_Menu from './components/top_menu/Top_Menu';

function App() {
  const id = 3;

  const [Username,setusername] = useState(null);
  const [Reload, setReload] = useState(true);

  return (
    <React.StrictMode>
      <Top_Menu/>
      <Dashboard_Section>
        <Side_menu  user_id={id} setReload={setReload} Reload={Reload}/>
        <Graph user_id={id} Reload={Reload}/>
      </Dashboard_Section>
    </React.StrictMode>
  );
  }

ReactDOM.render(<App />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(//console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
