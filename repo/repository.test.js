
const isTestEnv = process.env.NODE_ENV === 'test';

const { CriaUsuario, SelectUser, Delete_User, New_Transaction } = isTestEnv
  ? require("../repo/memrepository")
  : require("../repo/repository");
  
test('Create User', async () => {
    const nome = "John Doe";
    const userId = await CriaUsuario(nome);
  
    const search_user = await SelectUser(userId[0].id);

    expect(search_user.name).toBe(nome);
    expect(search_user.transactions.length).toBe(0)
    expect(search_user.stocks.length).toBe(0)

    await Delete_User(userId[0].id);

    expect(SelectUser(userId[0].id)).rejects;
});

test('Create Transactions and stocks', async () => {
    const nome = "John Doe";
    const userId = await CriaUsuario(nome);
  
    await New_Transaction(userId[0].id, 1, "BUY", 1, 14, new Date());
    await New_Transaction(userId[0].id, 1, "BUY", 1, 26, new Date());
    await New_Transaction(userId[0].id, 1, "BUY", 1, 20, new Date());
    await New_Transaction(userId[0].id, 1, "BUY", 1, 20, new Date());
    await New_Transaction(userId[0].id, 2, "BUY", 1, 14, new Date());
    await New_Transaction(userId[0].id, 3, "BUY", 1, 14, new Date());

    let search_user = await SelectUser(userId[0].id);
    
    expect(search_user.transactions.length).toBe(6)
    expect(search_user.stocks.length).toBe(3)

    await New_Transaction(userId[0].id, 3, "SELL", 1, 14, new Date());
    await New_Transaction(userId[0].id, 2, "SELL", 1, 14, new Date());

    search_user = await SelectUser(userId[0].id);
    expect(search_user.transactions.length).toBe(8)
    expect(search_user.stocks.length).toBe(1)

    await Delete_User(userId[0].id);
});


test('Avg price stock', async () => {
    const nome = "John Doe";
    const userId = await CriaUsuario(nome);
  
    await New_Transaction(userId[0].id, 1, "BUY", 1, 14, new Date());
    await New_Transaction(userId[0].id, 1, "BUY", 1, 26, new Date());
    await New_Transaction(userId[0].id, 1, "BUY", 1, 20, new Date());
    await New_Transaction(userId[0].id, 1, "BUY", 1, 28, new Date());

    let search_user = await SelectUser(userId[0].id);
    
    expect(search_user.stocks.length).toBe(1)
    expect(search_user.stocks[0].stock_id).toBe(1)
    expect(search_user.stocks[0].avg_price_in_real).toBe("0.22")

    await Delete_User(userId[0].id);
});