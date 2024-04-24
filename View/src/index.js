import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import MID_SECTION from './Mid_Section';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3300/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome: 'Juan' }), // Substitua 'Juan' pelo nome que você quer enviar
    })
      .then(async response => {
        if (!response.ok) {
          throw new Error('Failed to create user');
        }
        const result = await response.json();
        const id = result[0].id;
        console.log(id); 
        setData(id);
        return id;
      })
      .catch(error => {
        console.error('Error:', error);
      })
      .then(data => {
        console.log('User created:', data);
      })
      .catch(error => {
        console.error('Error creating user:', error);
      });
  }, []); // Empty dependency array to fetch data only once on component mount

  return (
    <React.StrictMode>
      <MID_SECTION data={ data }/>
    </React.StrictMode>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
