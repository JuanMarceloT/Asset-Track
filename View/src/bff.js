const api = 'http://localhost:3330';

async function createNewUser(Username){
  let result = await CallEndpointPost('user', {nome: `${Username}`});
  return result;
}

async function Create_New_Transaction(args){
  CallEndpointPost("transactions", args);
}

async function Get_Graph_Params(id){
  return await CallEndpointGet(`GetGraph?user_id=${id}`);
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



module.exports = { GetUser, Create_New_Transaction, createNewUser, Get_Graph_Params};