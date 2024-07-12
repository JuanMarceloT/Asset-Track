const id_stocksCode = new Map();
const stocksCode_id = new Map()
const id_stockName = new Map();
const id_StockImg = new Map();

function addStock(stock){
    if(!stock.id ||!stock.code || !stock.name ){
        console.error("Stock must have an id, code and a name!");
    }

    if(id_stocksCode.has(stock.id)){
        console.error("Stock already exists!");
    }

    if(stocksCode_id.has(stock.code)){
        console.error("Stock already exists!");
    }

    if(id_stockName.has(stock.id)){
        console.error("Stock already exists!");
    }

    id_stocksCode.set(stock.id, stock.code);
    stocksCode_id.set(stock.code, stock.id);
    id_stockName.set(stock.id, stock.name);

    if(stock.img_url){
        id_StockImg.set(stock.id, stock.img_url);
    }


}


addStock({id:6, code:"PETR4", name:"PETROBRAS", img_url:"https://cdn.worldvectorlogo.com/logos/petrobras-8.svg"});
addStock({id:5, code:"VALE3", name:"VALE3", img_url:"https://cdn.worldvectorlogo.com/logos/petrobras-8.svg"});
addStock({id:2, code:"ITUB4", name:"Itaú Unibanco", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Amazon_icon.svg/2500px-Amazon_icon.svg.png"});
addStock({id:1, code:"CASH3", name:"MELIUZ", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Amazon_icon.svg/2500px-Amazon_icon.svg.png"});

function get_stock_id_by_code(stock_code){
    return stocksCode_id.get(stock_code);
}

function get_stock_code_by_id(stock_id){
    return id_stocksCode.get(stock_id);
}

function get_stock_name_by_id(stock_name){
    return id_stockName.get(stock_name);
}

function get_stock_img_by_id(stock_id){
    return id_stockImg.get(stock_id);
}

module.exports =  { get_stock_id_by_code, get_stock_code_by_id, get_stock_name_by_id, get_stock_img_by_id };