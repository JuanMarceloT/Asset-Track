const id_stocksCode = new Map();
const stocksCode_id = new Map()
const id_stockName = new Map();
const id_StockImg = new Map();
let stocks = {};

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
    stocks[stock.id] = stock;

    if(stock.img_url){
        id_StockImg.set(stock.id, stock.img_url);
    }


}


addStock({id:6, code:"PETR4", name:"PETROBRAS", img_url:"https://cdn.worldvectorlogo.com/logos/petrobras-8.svg"});
addStock({id:5, code:"VALE3", name:"VALE3", img_url:"https://s3-symbol-logo.tradingview.com/vale--600.png"});
addStock({id:2, code:"ITUB4", name:"Itaú Unibanco", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banco_Ita%C3%BA_logo.svg/1011px-Banco_Ita%C3%BA_logo.svg.png"});
addStock({id:1, code:"CASH3", name:"MELIUZ", img_url:"https://yt3.googleusercontent.com/cxDKS7OTT2SB4CNFHlrAvCDivGJR70H8ne8607esi9q6ALGQClYZPa03qcAR0ynhCtYS5JNMBA=s900-c-k-c0x00ffffff-no-rj"});


function get_all_stocks(){
    return stocks;
}

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
    return id_StockImg.get(stock_id);
}

module.exports =  { get_stock_id_by_code, get_stock_code_by_id, get_stock_name_by_id, get_stock_img_by_id, get_all_stocks };