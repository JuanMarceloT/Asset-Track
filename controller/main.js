
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');



const app = express();
const port = 3330;
app.use(cors()); 
app.use(bodyParser.json());

const {inicializarDb, SelectUser, SelectUsers, CriaUsuario,Nova_Tranasção, formatDate, GetMontlyAsset, get_stock_close_price} = require('../repo/repository');

async function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function main() {
  const Graph = await get_stock_close_price("PETR4", "2023-20-10");
  console.log("Starting delay...");
  await delay(1000); // Waits for 5 seconds
  console.log("5 seconds have passed.");
  console.log(Graph);
}

main();


// API endpoint to get all users
app.get('/users', async (req, res) => {
  try {
    const users = await SelectUsers();
    res.json(users);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to get user info
app.get('/GetUser', async (req, res) => {
  try {
    //console.log(req.query);
    const { user_id } = req.query;
    const user = await SelectUser(user_id);;
    res.json(user);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/GetGraph', async(req,res)=>{

  try{
    const {user_id} = req.query;
    const Graph = await GetMontlyAsset(user_id);
    
    res.json(Graph);
  }catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})


// API endpoint to create a new user
app.post('/users', async (req, res) => {
  try {
    const { nome } = req.body;
    const id = await CriaUsuario(nome);
    res.status(201).json(id);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to create a new transaction
app.post('/transactions', async (req, res) => {
  try {
    const { user_id, stock_id, type, units, price, year, month, day } = req.body;
    const transação = await Nova_Tranasção(user_id, stock_id, type, units, price, formatDate(year, month, day));
    res.status(201).json(transação);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  inicializarDb();
  console.log(`Server running at http://localhost:${port}`);
});

