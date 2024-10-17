const api = process.env.REACT_APP_API_URL;

async function createNewUser(Username){
  let result = await CallEndpointPost('create_user', {nome: `${Username}`});
  return result;
}

async function Create_New_Transaction(args){
  CallEndpointPost("transactions", args);
}

async function Get_Graph_Params(id, TimePeriod){
  return await CallEndpointGet(`GetGraph?user_id=${id}&time_period=${TimePeriod}`);
}

async function Get_Dividend_Graph_Params(id, TimePeriod){
  return await CallEndpointGet(`GetDividendGraph?user_id=${id}&time_period=${TimePeriod}`);
}

async function Get_Percent_Graph_Params(id, TimePeriod){
  return await CallEndpointGet(`GetPercentGraph?user_id=${id}&time_period=${TimePeriod}`);
}

async function Get_Index_Percent_Graph_Params(index, TimePeriod){
  return await CallEndpointGet(`GetIndexPercentGraph?index=${index}&time_period=${TimePeriod}`);
}

async function Get_Dividends(id){
  return await CallEndpointGet(`GetUserDividends?user_id=${id}`);
}

async function GetStockInfos(){
  return await CallEndpointGet(`GetStocksInfo`);
}

async function GetId(){
  return await CallEndpointGet(`temp_user`);
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

async function get_stock_price_by_id(id){
  const price = await CallEndpointGet(`Stock_price?stock_id=${id}`);
  return price;
}


async function get_assets_total_value(stocks) {
  // Create a copy of stocks to avoid mutating the original array
  const stocksCopy = [...stocks];

  const pricePromises = stocksCopy.map(async (stock) => {
    const price = await get_stock_price_by_id(stock.stock_id);
    return price * stock.units;
  });

  const totalValues = await Promise.all(pricePromises);
  const totalAssetsValue = totalValues.reduce((acc, value) => acc + value, 0);

  return totalAssetsValue;
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


module.exports = { GetUser,get_assets_total_value,Get_Percent_Graph_Params,GetStockInfos,Get_Dividend_Graph_Params,Get_Index_Percent_Graph_Params,  Create_New_Transaction, createNewUser, Get_Graph_Params, get_stock_price_by_id, Get_Dividends, formatMonthYear, get_ytd_dividends, GetId};