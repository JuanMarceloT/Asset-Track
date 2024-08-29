const api = 'http://localhost:3330';

async function createNewUser(Username){
  let result = await CallEndpointPost('user', {nome: `${Username}`});
  return result;
}

async function Create_New_Transaction(args){
  CallEndpointPost("transactions", args);
}

async function Get_Graph_Params(id, TimePeriod){
  return await CallEndpointGet(`GetGraph?user_id=${id}&time_period=${TimePeriod}`);
}
async function Get_Dividends(id){
  return await CallEndpointGet(`GetUserDividends?user_id=${id}`);
}



async function CallEndpointPost(endpoint, bodyjson){
  fetch(api + `/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyjson),
  })
    .then(async response => {
      if (!response.ok) {
        throw new Error('Failed to call' + endpoint);
      }
      //let result = await response.json();  esse .json ta dando problema
      //return result;
    })
    .catch(error => {
      console.error('Errors:', error);
    })


}
async function CallEndpointGet(endpoint) {
  try {
    const response = await fetch(api + `/${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to call ' + endpoint);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error; // Rethrow the error to propagate it to the caller
  }
}

async function GetUser(id) {
  try {
    const user = await CallEndpointGet(`GetUser?user_id=${id}`);
    return user;
  } catch (error) {
    // Handle the error (e.g., show a message to the user)
    console.error('Failed to get user:', error);
  }
}

function get_stock_name_by_id(id){
  switch(id){
    case 1:
      return "Itáu";
    case 2:
      return "Petrobrás";
    default:
      return "Non sei";
  }
}

function get_stock_code_by_id(id){
  switch(id){
    case 1:
      return "ITUB4";
    case 2:
      return "PETR4";
    default:
      return "Non sei";
  }
}

function get_stock_img_by_id(id){
  switch(id){
    case 2:
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banco_Ita%C3%BA_logo.svg/1011px-Banco_Ita%C3%BA_logo.svg.png";
    case 6:
      return "https://cdn.worldvectorlogo.com/logos/petrobras-8.svg";
    case 5: 
      return "https://s3-symbol-logo.tradingview.com/vale--600.png";
    case 1:
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Amazon_icon.svg/2500px-Amazon_icon.svg.png";
    default:
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Amazon_icon.svg/2500px-Amazon_icon.svg.png'
  }
}

function get_stock_price_by_id(id){
  switch(id){
    case 1:
      return 1.15;
    case 2:
      return 18.16;
    default:
      return 7.15;
  }
}

function formatMonthYear(year, month) {
  const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
  ];
  let formattedDate = "";
  formattedDate = `${monthNames[parseInt(month, 10) - 1]}, ${year}`;
  return formattedDate;
}
function get_ytd_dividends(dividend){
  let total_Dividends = 0;
  // console.log(dividend);
  let current_year = new Date().getFullYear();
  Object.keys(dividend).map(dividend_id => {
    if(dividend[dividend_id]["year"] == current_year){
      total_Dividends += dividend[dividend_id]["Dividends"]["total_Dividends"];
    }
  });
  return total_Dividends;
}


module.exports = { GetUser, Create_New_Transaction, createNewUser, Get_Graph_Params, get_stock_code_by_id, get_stock_name_by_id, get_stock_img_by_id, get_stock_price_by_id, Get_Dividends, formatMonthYear, get_ytd_dividends};