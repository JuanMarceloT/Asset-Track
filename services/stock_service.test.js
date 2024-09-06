
const isTestEnv = process.env.NODE_ENV === 'test';

let CriaUsuario, SelectUser, Delete_User, New_Transaction ;

if(isTestEnv){
    ({ CriaUsuario, SelectUser, Delete_User, New_Transaction }) = require("../repo/memrepository")
}

if(!isTestEnv){
    ({ CriaUsuario, SelectUser, Delete_User, New_Transaction }) = require("../repo/repository")
}

const { getPortfolioStockDates } = require("./stock_service");

test('getPortfolioStockDates test', async () => {
    const nome = "John Doe";
    const userId = await CriaUsuario(nome);
  
    await New_Transaction(userId[0].id, 2, "BUY", 1, 14, new Date("2019-02-05"));
    await New_Transaction(userId[0].id, 6, "BUY", 1, 14, new Date("2022-03-05"));
    await New_Transaction(userId[0].id, 2, "BUY", 12, 14, new Date("2022-03-05"));
    await New_Transaction(userId[0].id, 1, "BUY", 1, 14, new Date("2022-08-05"));
    await New_Transaction(userId[0].id, 1, "SELL", 1, 14, new Date("2023-11-13"));
    await New_Transaction(userId[0].id, 2, "SELL", 13, 14, new Date("2022-11-23"));

    
    let portfolioStockDates = await getPortfolioStockDates(userId[0].id);

    console.log(portfolioStockDates);
    
    expect(portfolioStockDates).toEqual([
        { stock_id: 2, initial_date: '2019-02-05', end_date: '2022-11-23' },
        { stock_id: 6, initial_date: '2022-03-05', end_date: null },
        { stock_id: 1, initial_date: '2022-08-05', end_date: '2023-11-13' }
    ]);


    await Delete_User(userId[0].id);
});