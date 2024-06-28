
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');



const app = express();
const port = 3330;
app.use(cors()); 
app.use(bodyParser.json());

const {inicializarDb, SelectUser, SelectUsers, CriaUsuario,Nova_Tranasção, formatDate, getMonthlyAsset, get_stock_close_price, get_User_monthly_dividends} = require('../repo/repository');


async function main() {
  //const Graph = await get_User_monthly_dividends(15);
  ////console.log("Starting delay...");
  ////console.log(Graph);
}

main();


// API endpoint to get all users
app.get('/users', async (req, res) => {
  try {
    const users = await SelectUsers();
    res.json(users);
  } catch (error) {
    //console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to get user info
app.get('/GetUser', async (req, res) => {
  //console.log("quando user");
  try {
    //console.log(req.query);
    const { user_id } = req.query;
    const user = await SelectUser(user_id);;
    res.json(user);
  } catch (error) {
    //console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/GetGraph', async(req,res)=>{
  //console.log("quando user");
  //console.log(req.query);
  try{
    const {user_id} = req.query;
    const Graph = await getMonthlyAsset(user_id);
    
    res.json(Graph);
  }catch (error) {
    //console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.get('/GetUserDividends', async(req,res)=>{

  try{
    //console.log("quando user");
    //console.log(req.query);
    const {user_id} = req.query;
    const Dividends = await get_User_monthly_dividends(user_id);
    
    res.json(Dividends);
  }catch (error) {
    //console.error('Error:', error);
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
    //console.error('Error:', error);
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
    //console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  inicializarDb();
  //console.log(`Server running at http://localhost:${port}`);
});

