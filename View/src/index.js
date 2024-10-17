import React, { useState, useEffect } from 'react';
import './config.js'; // Import the global configuration here
import ReactDOM from 'react-dom';
import Side_menu from './components/side_menu/Side_menu';
import './index.css';
import Graph from './components/graph/graph';
import { GetId} from './bff.js';

import Dashboard_Section from './Dashboard_Section';
import Top_Menu from './components/top_menu/Top_Menu';

const saveUserId = (userId) => {
  sessionStorage.setItem('userId', userId);
};

const getUserId = () => {
  return sessionStorage.getItem('userId');
};

function App() {

  const [id, setId] = useState(null); // Initialize state
  // const [Username,setusername] = useState(null);
  const [Reload, setReload] = useState(true);

  useEffect(() => {
    // Function to fetch the ID and update the state
    const fetchId = async () => {
      try {
        const storedId = getUserId(); // Check sessionStorage first

        // Remember that the memory database resets when the Node server is restarted,
        // meaning your ID will no longer exist. 
        // However, you may still be trying to connect with an ID that has been deleted

        // if (storedId) {
        //   setId(storedId);
        //   return;
        // }

        const fetchedId = await GetId();
        setId(fetchedId);
        saveUserId(fetchedId); // Save fetched ID to sessionStorage

      } catch (error) {
        console.error('Error fetching ID:', error);
      }
    };

    fetchId();
  }, []); // Empty dependency array means this runs once when the component mounts
  
  if (id === null) {
    return <div>Loading...</div>; // Show a loading state while fetching
  }

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
