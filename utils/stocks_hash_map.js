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


addStock({id:1, code:"PETR4", name:"PETROBRAS", img_url:"https://cdn.worldvectorlogo.com/logos/petrobras-8.svg"});
addStock({id:2, code:"VALE3", name:"VALE", img_url:"https://s3-symbol-logo.tradingview.com/vale--600.png"});
addStock({id:3, code:"ITUB4", name:"Itaú Unibanco", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banco_Ita%C3%BA_logo.svg/1011px-Banco_Ita%C3%BA_logo.svg.png"});
addStock({id:4, code:"BBDC4", name:"Bradesco", img_url:"https://t2.tudocdn.net/625915?w=1200&h=1200"});
addStock({id:5, code:"BBAS3", name:"Banco do Brasil", img_url:"https://logopng.com.br/logos/banco-do-brasil-5.svg"});
addStock({id:6, code:"ABEV3", name:"Ambev", img_url:"https://assets.hgbrasil.com/finance/companies/big/ambev-s-a.png"});
addStock({id:7, code:"MGLU3", name:"Magazine Luiza", img_url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZFxiIX_NpZaA_7Dz6sep4I-rKeCjSclLQBA&s"});
addStock({id:8, code:"B3SA3", name:"B3", img_url:"https://assets.hgbrasil.com/finance/companies/big/b3.png"});
addStock({id:9, code:"SUZB3", name:"Suzano", img_url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB0qXvWr2ya6J7EuCqOFQwMScrQO7gGhtO2g&s"});
addStock({id:10, code:"LREN3", name:"Lojas Renner", img_url:"https://s3-symbol-logo.tradingview.com/lojas-renner--600.png"});
addStock({id:11, code:"RENT3", name:"Localiza", img_url:"https://s3-symbol-logo.tradingview.com/localiza--600.png"});
addStock({id:12, code:"GGBR4", name:"Gerdau", img_url:"https://companieslogo.com/img/orig/GGB-9d3efdda.png?t=1721707160"});
// addStock({id:13, code:"CSNA3", name:"CSN", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/CSN_logo.svg/1024px-CSN_logo.svg.png"});
// addStock({id:14, code:"JBSS3", name:"JBS", img_url:"https://s3-symbol-logo.tradingview.com/jbs--600.png"});
addStock({id:15, code:"WEGE3", name:"WEG", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Weg_logo_blue_vector.svg/1200px-Weg_logo_blue_vector.svg.png"});
addStock({id:16, code:"CASH3", name:"MELIUZ", img_url:"https://yt3.googleusercontent.com/cxDKS7OTT2SB4CNFHlrAvCDivGJR70H8ne8607esi9q6ALGQClYZPa03qcAR0ynhCtYS5JNMBA=s900-c-k-c0x00ffffff-no-rj"});
addStock({id:17, code:"EGIE3", name:"Engie Brasil", img_url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdZF6DUqvU_NTODGXYDrbMc9DY_z7WnFuu3g&s"});
addStock({id:18, code:"CPLE6", name:"Copel", img_url:"https://folhadepalotina.com.br/wp-content/uploads/2021/04/Copellogo1.jpg"});
// addStock({id:19, code:"EQTL3", name:"Equatorial", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Logo_equatorial_energia.svg/1024px-Logo_equatorial_energia.svg.png"});
addStock({id:20, code:"VVAR3", name:"Via Varejo", img_url:"https://upload.wikimedia.org/wikipedia/commons/f/f2/Logo_ViaVarejo_VVar.jpg"});
addStock({id:21, code:"KLBN11", name:"Klabin", img_url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsKl3WExhRO0NzDICgPDc7oj7C6lExRTeTIQ&s"});
addStock({id:22, code:"ELET3", name:"Eletrobras", img_url:"https://upload.wikimedia.org/wikipedia/commons/b/b3/Eletrobras.png"});
addStock({id:23, code:"BRKM5", name:"Braskem", img_url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwp8Uj3QGMdeRY9g7a5kdro1NTryt_oIMEKA&s"});
// addStock({id:24, code:"BEEF3", name:"Minerva", img_url:"https://s3-symbol-logo.tradingview.com/minerva--600.png"});
// addStock({id:25, code:"MRFG3", name:"Marfrig", img_url:"https://upload.wikimedia.org/wikipedia/commons/8/8b/Marfrig_Logo.png"});

// need to fix the img_url

// addStock({id:26, code:"RAIL3", name:"Rumo", img_url:"https://upload.wikimedia.org/wikipedia/commons/9/9f/Rumo_Logo.png"});
// addStock({id:27, code:"BTOW3", name:"B2W", img_url:"https://upload.wikimedia.org/wikipedia/commons/5/5b/B2W_logo.png"});
// addStock({id:28, code:"HYPE3", name:"Hypera", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Hypera_Pharma_logo.svg/1024px-Hypera_Pharma_logo.svg.png"});
// addStock({id:29, code:"RADL3", name:"Raia Drogasil", img_url:"https://upload.wikimedia.org/wikipedia/commons/f/f8/RaiaDrogasil_logo.png"});
// addStock({id:30, code:"BRML3", name:"BR Malls", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/BRMALLS_Logo.svg/1024px-BRMALLS_Logo.svg.png"});
// addStock({id:31, code:"MULT3", name:"Multiplan", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Logo_multiplan.svg/1024px-Logo_multiplan.svg.png"});
// addStock({id:32, code:"LAME4", name:"Lojas Americanas", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Americanas_logo.svg/2560px-Americanas_logo.svg.png"});
// addStock({id:33, code:"HGTX3", name:"Cia Hering", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Logo_Hering.svg/1024px-Logo_Hering.svg.png"});
// addStock({id:34, code:"BRPR3", name:"BR Properties", img_url:"https://upload.wikimedia.org/wikipedia/commons/8/83/BR_Properties.png"});
// addStock({id:35, code:"PSSA3", name:"Porto Seguro", img_url:"https://upload.wikimedia.org/wikipedia/commons/2/29/Porto_Seguro.png"});
// addStock({id:36, code:"SLCE3", name:"SLC Agrícola", img_url:"https://upload.wikimedia.org/wikipedia/commons/2/27/SLC_Agr%C3%ADcola_logo.svg"});
// addStock({id:37, code:"BRFS3", name:"BRF", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/BRF_logo.svg/2560px-BRF_logo.svg.png"});
// addStock({id:38, code:"TOTS3", name:"TOTVS", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Logo_Totvs.png/1024px-Logo_Totvs.png"});
// addStock({id:39, code:"CVCB3", name:"CVC", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/CVC_logo.svg/1024px-CVC_logo.svg.png"});
// addStock({id:40, code:"ENBR3", name:"Energias do Brasil", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/EDP_logo.svg/1024px-EDP_logo.svg.png"});
// addStock({id:41, code:"TAEE11", name:"Taesa", img_url:"https://upload.wikimedia.org/wikipedia/commons/8/84/Taesa_logo.png"});
// addStock({id:42, code:"ALPA4", name:"Alpargatas", img_url:"https://upload.wikimedia.org/wikipedia/commons/1/1f/Alpargatas_logo.png"});
// addStock({id:43, code:"GOLL4", name:"Gol Linhas Aéreas", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/GOL_Airlines_logo.svg/1024px-GOL_Airlines_logo.svg.png"});
// addStock({id:44, code:"CCRO3", name:"CCR", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/CCR_S.A._logo.svg/1024px-CCR_S.A._logo.svg.png"});
// addStock({id:45, code:"CMIG4", name:"Cemig", img_url:"https://upload.wikimedia.org/wikipedia/commons/5/5e/Cemig.png"});
// addStock({id:46, code:"NEOE3", name:"Neoenergia", img_url:"https://upload.wikimedia.org/wikipedia/commons/f/fd/Logo_neoenergia.jpg"});
// addStock({id:47, code:"FLRY3", name:"Fleury", img_url:"https://upload.wikimedia.org/wikipedia/commons/6/6b/Grupo_Fleury.png"});
// addStock({id:48, code:"SAPR11", name:"Sanepar", img_url:"https://upload.wikimedia.org/wikipedia/commons/9/9e/Sanepar_logo.png"});
// addStock({id:49, code:"VIVT3", name:"Vivo", img_url:"https://upload.wikimedia.org/wikipedia/commons/4/44/Vivo_logo.png"});
// addStock({id:50, code:"TIMP3", name:"TIM", img_url:"https://upload.wikimedia.org/wikipedia/commons/e/e5/TIM_logo.png"});
// addStock({id:51, code:"CSAN3", name:"Cosan", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Cosan_logo.svg/1200px-Cosan_logo.svg.png"});
// addStock({id:52, code:"BRAP4", name:"Bradespar", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Logo_Bradespar.png/1024px-Logo_Bradespar.png"});
// addStock({id:53, code:"USIM5", name:"Usiminas", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Usiminas_logo.svg/1024px-Usiminas_logo.svg.png"});
// addStock({id:54, code:"CYRE3", name:"Cyrela", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Cyrela_logo.svg/1200px-Cyrela_logo.svg.png"});
// addStock({id:55, code:"EZTC3", name:"EZTEC", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Eztec_logo.svg/1024px-Eztec_logo.svg.png"});
// addStock({id:56, code:"GFSA3", name:"Gafisa", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Gafisa_logo.svg/1200px-Gafisa_logo.svg.png"});
// addStock({id:57, code:"MRVE3", name:"MRV", img_url:"https://upload.wikimedia.org/wikipedia/commons/6/6e/MRV_logo.png"});
// addStock({id:58, code:"JHSF3", name:"JHSF", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/JHSF_logo.svg/1024px-JHSF_logo.svg.png"});
// addStock({id:59, code:"GNDI3", name:"NotreDame Intermédica", img_url:"https://upload.wikimedia.org/wikipedia/commons/f/f1/NotreDame_Interm%C3%A9dica_logo.png"});
// addStock({id:60, code:"YDUQ3", name:"Yduqs", img_url:"https://upload.wikimedia.org/wikipedia/commons/e/ef/Yduqs_Logo.png"});
// addStock({id:61, code:"COGN3", name:"Cogna", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Logo-cogna.svg/1024px-Logo-cogna.svg.png"});
// addStock({id:62, code:"BIDI11", name:"Banco Inter", img_url:"https://upload.wikimedia.org/wikipedia/commons/3/36/Logo_banco_inter.png"});
// addStock({id:63, code:"IRBR3", name:"IRB Brasil", img_url:"https://upload.wikimedia.org/wikipedia/commons/1/10/IRB-Brasil-RE.png"});
// addStock({id:64, code:"SEER3", name:"Ser Educacional", img_url:"https://upload.wikimedia.org/wikipedia/commons/5/52/Ser_Educacional_logo.png"});
// addStock({id:65, code:"QUAL3", name:"Qualicorp", img_url:"https://upload.wikimedia.org/wikipedia/commons/0/02/Qualicorp_logo.png"});
// addStock({id:66, code:"PRIO3", name:"PetroRio", img_url:"https://upload.wikimedia.org/wikipedia/commons/7/74/PetroRio.png"});
// addStock({id:67, code:"MOVI3", name:"Movida", img_url:"https://upload.wikimedia.org/wikipedia/commons/2/2c/Movida.png"});
// addStock({id:68, code:"SULA11", name:"SulAmérica", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/SulAm%C3%A9rica_logo.svg/1200px-SulAm%C3%A9rica_logo.svg.png"});
// addStock({id:69, code:"PARD3", name:"Hermes Pardini", img_url:"https://upload.wikimedia.org/wikipedia/commons/1/1b/Hermes_Pardini_logo.png"});
// addStock({id:70, code:"BRSR6", name:"Banrisul", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Banrisul_logo.svg/2560px-Banrisul_logo.svg.png"});
// addStock({id:71, code:"SANB11", name:"Santander Brasil", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Logo_Santander_Brasil.png/600px-Logo_Santander_Brasil.png"});
// addStock({id:72, code:"VULC3", name:"Vulcabras", img_url:"https://upload.wikimedia.org/wikipedia/commons/1/17/Vulcabras_logo.png"});
// addStock({id:73, code:"ALSC3", name:"Alpargatas", img_url:"https://upload.wikimedia.org/wikipedia/commons/1/1f/Alpargatas_logo.png"});
// addStock({id:74, code:"MDIA3", name:"M. Dias Branco", img_url:"https://upload.wikimedia.org/wikipedia/commons/c/c4/M._Dias_Branco.png"});
// addStock({id:75, code:"ENEV3", name:"Eneva", img_url:"https://upload.wikimedia.org/wikipedia/commons/c/ca/Eneva_logo.png"});
// addStock({id:76, code:"ARZZ3", name:"Arezzo", img_url:"https://upload.wikimedia.org/wikipedia/commons/4/4a/Arezzo_Logo.png"});
// addStock({id:77, code:"BLAU3", name:"Blau Farmacêutica", img_url:"https://upload.wikimedia.org/wikipedia/commons/a/af/Blau_Farmac%C3%AAutica_Logo.png"});
// addStock({id:78, code:"CAML3", name:"Camil", img_url:"https://upload.wikimedia.org/wikipedia/commons/6/66/Camil_logo.png"});
// addStock({id:79, code:"ANIM3", name:"Ânima Educação", img_url:"https://upload.wikimedia.org/wikipedia/commons/5/50/%C3%82nima_Educa%C3%A7%C3%A3o_Logo.png"});
// addStock({id:80, code:"SMLS3", name:"Smiles Fidelidade", img_url:"https://upload.wikimedia.org/wikipedia/commons/7/7e/Smiles_Logo.png"});
// addStock({id:81, code:"IGTA3", name:"Iguatemi", img_url:"https://upload.wikimedia.org/wikipedia/commons/9/95/Iguatemi_Logo.png"});
// addStock({id:82, code:"HAPV3", name:"Hapvida", img_url:"https://upload.wikimedia.org/wikipedia/commons/f/fe/Hapvida_Logo.png"});
// addStock({id:83, code:"VIVA3", name:"Vivara", img_url:"https://upload.wikimedia.org/wikipedia/commons/f/f9/Vivara_logo.png"});
// addStock({id:84, code:"MILS3", name:"Mills", img_url:"https://upload.wikimedia.org/wikipedia/commons/3/38/Mills_logo.png"});
// addStock({id:85, code:"SMTO3", name:"São Martinho", img_url:"https://upload.wikimedia.org/wikipedia/commons/a/ab/S%C3%A3o_Martinho_Logo.png"});
// addStock({id:86, code:"POSI3", name:"Positivo", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Logo_Positivo_Tecnologia.png/1024px-Logo_Positivo_Tecnologia.png"});
// addStock({id:87, code:"CEAB3", name:"C&A", img_url:"https://upload.wikimedia.org/wikipedia/commons/4/4c/C%26A_Logo.png"});
// addStock({id:88, code:"SEQL3", name:"Sequoia", img_url:"https://upload.wikimedia.org/wikipedia/commons/8/84/Sequoia_Log.png"});
// addStock({id:89, code:"TRPL4", name:"Transmissão Paulista", img_url:"https://upload.wikimedia.org/wikipedia/commons/3/35/Transmiss%C3%A3o_Paulista_Logo.png"});
// addStock({id:90, code:"ENGI11", name:"Engie Brasil", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Engie_logo.svg/1200px-Engie_logo.svg.png"});
// addStock({id:91, code:"CPFE3", name:"CPFL Energia", img_url:"https://upload.wikimedia.org/wikipedia/commons/6/6e/CPFL_Energia_logo.png"});
// addStock({id:92, code:"PETZ3", name:"Petz", img_url:"https://upload.wikimedia.org/wikipedia/commons/7/74/Petz_logo.png"});
// addStock({id:93, code:"CVCB3", name:"CVC Brasil", img_url:"https://upload.wikimedia.org/wikipedia/commons/f/f1/CVC_Logo.png"});
// addStock({id:94, code:"MEAL3", name:"IMC", img_url:"https://upload.wikimedia.org/wikipedia/commons/a/ae/IMC_logo.png"});
// addStock({id:95, code:"MRFG3", name:"Marfrig", img_url:"https://upload.wikimedia.org/wikipedia/commons/a/aa/Marfrig_Global_Foods_Logo.png"});
// addStock({id:96, code:"ENBR3", name:"Energias do Brasil", img_url:"https://upload.wikimedia.org/wikipedia/commons/7/70/Energias_do_Brasil_logo.png"});
// addStock({id:97, code:"UNIP6", name:"Unipar", img_url:"https://upload.wikimedia.org/wikipedia/commons/9/94/Unipar_logo.png"});
// addStock({id:98, code:"B3SA3", name:"B3", img_url:"https://upload.wikimedia.org/wikipedia/commons/5/5a/B3_Logo.png"});
// addStock({id:99, code:"TOTS3", name:"TOTVS", img_url:"https://upload.wikimedia.org/wikipedia/commons/8/81/TOTVS_logo.png"});
// addStock({id:100, code:"SULA11", name:"Sul América", img_url:"https://upload.wikimedia.org/wikipedia/commons/0/09/SulAm%C3%A9rica_logo.png"});


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