const { Stocks_aggregated_by_month, Stocks_aggregated } = require("../repo/repository")
const { getLastWeekdaysSince, formatDate, compare_string_yyyy_mm_dd_dates, date_to_yyyy_mm_dd } = require("../utils/date_utils");
const { get_stock_code_by_id } = require("../utils/stocks_hash_map");



async function get_daily_close_price(stockName, date) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/stock/${stockName}.SA/${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}`);
        //console.log(date);
        if (!response.ok) {
            return undefined;
        }
        const data = await response.json();

        return data[0]?.Close ?? 0;

    } catch (error) {
        console.error('Error:', error);
    }

}

async function get_stock_price(stockName) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/stock_last_price/${stockName}.SA/`);
        if (!response.ok) {
            return undefined;
        }
        const data = await response.json();

        return data ?? 0;

    } catch (error) {
        console.error('Error:', error);
    }

}


async function get_period_close_prices(stockName, initial, end, time_period) {
    try {

        let response;
        if (!end) {
            let current_date = new Date().toISOString().slice(0, 10);
            response = await fetch(`http://127.0.0.1:5000/stock_period/${stockName}.SA/${initial}/${current_date}/${time_period}`);
        } else {
            response = await fetch(`http://127.0.0.1:5000/stock_period/${stockName}.SA/${initial}/${end}/${time_period}`);
        }
        //console.log(date);
        if (!response.ok) {
            return undefined;
        }
        const data = await response.json();

        return data ?? 0;

    } catch (error) {
        console.error('Error:', error);
    }
}

async function get_stock_dividends_in_month(stock_code, month) {
    //console.log(stock_code);
    if (stock_code == "PETR4") {
        return {
            "2020-01-01": 20.48,
            "2020-01-02": 1.48,
        };
    }
    return {
        "2020-01-01": 0.48,
        "2020-01-02": 0.48,
    };
    try {
        const response = await fetch(`http://127.0.0.1:5000/dividends/${stock_code}.SA/${month.getFullYear()}-${month.getMonth() + 1}`);
        //console.log(date);
        if (!response.ok) {
            return undefined;
        }
        const data = await response.json();

        return data[0] ?? 0;

    } catch (error) {
        console.error('Error:', error);
    }
}

async function get_stock_dividends_by_period(stock_code, initial_date, end_date) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/dividends_period/${stock_code}.SA/${date_to_yyyy_mm_dd(initial_date)}/${date_to_yyyy_mm_dd(end_date)}`);
        //console.log(date);
        if (!response.ok) {
            return undefined;
        }
        const data = await response.json();

        return data ?? 0;

    } catch (error) {
        console.error('Error:', error);
    }
}

async function calculateDividendsInMonth(stocks, month) {
    let Dividends = {};
    let total_Dividends = 0;

    for (const stock of stocks) {
        let stock_dividends_in_month = await get_stock_dividends_in_month(get_stock_code_by_id(stock.stock_id), month);
        let stock_dividends = 0;
        //console.log(stock_dividends_in_month);
        for (const [date, dividend] of Object.entries(stock_dividends_in_month)) {
            stock_dividends += dividend;
        }
        Dividends[stock.stock_id] = {
            dividends_per_share: stock_dividends,
            total_Dividends: stock_dividends * stock.total_qtd,
        };

        total_Dividends += stock_dividends * stock.total_qtd;
    }
    return {
        "total_Dividends": total_Dividends,
        "stock_dividends": Dividends
    };
}


async function get_User_monthly_dividends(user_id) {
    try {
        const stocksByMonth = await Stocks_aggregated(user_id);
        let currentIndex = 0;
        let final = {
        }
        let stocks_date = await getPortfolioStockDates(user_id);
        const stocks_units = await getPortfolioStockUnits(user_id);

        for (const stock of stocks_date) {
            // console.log(stock);
            let end_date = new Date();
            if (stock.end_date != null) {
                end_date = new Date(stock.end_date);
            }
            let dividends = await get_stock_dividends_by_period(get_stock_code_by_id(stock.stock_id), new Date(stock.initial_date), end_date);
            // console.log(dividends);
            Object.keys(dividends).forEach(key => {
                let date = new Date(key);
                let year = date.getFullYear().toString();
                let month = date.getMonth().toString();
                let day = date.getDate().toString();

                if (!final[year]) {
                    final[year] = {
                        total_earned: 0,
                        months: {}
                    };
                }

                if (!final[year]['months'][month]) {
                    final[year]['months'][month] = {
                        total_earned: 0,
                        days: {
                        }
                    };
                }

                if (!final[year]['months'][month][day]) {
                    final[year]['months'][month]["days"][day] = {
                        total_earned: 0
                    };
                }

                if (!final[year]['months'][month]["days"][day][get_stock_code_by_id(stock.stock_id)]) {
                    final[year]['months'][month]["days"][day][get_stock_code_by_id(stock.stock_id)] = dividends[key];
                    let units = getStockQtdbyDate(stocks_units, stock.stock_id, date)
                    final[year]['months'][month]["days"][day]["total_earned"] += dividends[key] * units;
                    final[year]['months'][month]["total_earned"] += dividends[key] * units;
                    final[year]['total_earned'] += dividends[key] * units;
                }

            });
        }


        return final;
    } catch (error) {
        console.error("Error:", error);
    }
}





async function getPortfolioStockDates(user_id) {
    const stocks_dates = [];

    try {
        const stocksByTimePeriod = await Stocks_aggregated(user_id);
        ;
        for (const transaction_date in stocksByTimePeriod) {
            let { date, stocks } = stocksByTimePeriod[transaction_date];
            let actual_date = date;

            for (const stock_index in stocks) {
                let stock = stocks[stock_index];
                const foundStock = stocks_dates.find(transaction_date => transaction_date.stock_id === stock.stock_id);
                if (!foundStock) {
                    stocks_dates.push({
                        stock_id: stock.stock_id,
                        initial_date: actual_date,
                        end_date: null
                    });
                }
            }

            for (const stock_date in stocks_dates) {
                let stock = stocks_dates[stock_date];
                const foundStock = stocks.find(transaction_date => transaction_date.stock_id == stock.stock_id);
                if (!foundStock && stock.end_date === null) {
                    stock.end_date = actual_date;
                }
            }
        }
        // console.log(stocks_dates);
        return stocks_dates;
    } catch (ex) {
        console.error("Error:", ex);
    }
}


async function getPortfolioStockUnits(user_id) {
    const stocks_units = {};

    try {
        const stocksByTimePeriod = await Stocks_aggregated(user_id);
        ;
        for (const transaction_date in stocksByTimePeriod) {
            let { date, stocks } = stocksByTimePeriod[transaction_date];
            let actual_date = date;

            for (const stock_index in stocks) {
                let stock = stocks[stock_index];

                if (!stocks_units[actual_date]) {
                    stocks_units[actual_date] = {}
                }

                stocks_units[actual_date][stock.stock_id] = stock.total_qtd;
            }

        }
        //console.log(stocks_units);
        return stocks_units;
    } catch (ex) {
        console.error("Error:", ex);
    }
}


function getStockQtdbyDate(stocks_units, stock_id, date) {
    let last_date = null;
    Object.entries(stocks_units).map(date_stock => compare_string_yyyy_mm_dd_dates(date, date_stock[0]) ? last_date = date_stock : date_stock)

    if (last_date) {
        stock_qtd = last_date[1][stock_id];
    }
    return stock_qtd ?? 0;
}


async function getAssetValueByPeriod(user_id, time_period) {
    const assetByTimePeriod = {};

    try {
        const stocks_prices = await getPortfolioStockDates(user_id);
        const stocks_units = await getPortfolioStockUnits(user_id);
        for (const transaction_date of stocks_prices) {
            console.log(transaction_date);

            stock_price = await get_period_close_prices(get_stock_code_by_id(transaction_date.stock_id), transaction_date.initial_date, transaction_date.end_date, "1d");
            stock_price && stock_price.map(stock => {
                //console.log(getStockQtdbyDate(stocks_units, transaction_date.stock_id, stock.Date))
                if (!assetByTimePeriod[stock.Date]) {
                    assetByTimePeriod[stock.Date] = +stock.Close.toFixed(2) * getStockQtdbyDate(stocks_units, transaction_date.stock_id, stock.Date);
                } else {
                    assetByTimePeriod[stock.Date] += +stock.Close.toFixed(2) * getStockQtdbyDate(stocks_units, transaction_date.stock_id, stock.Date);
                }
            });
        }

        //console.log(assetByTimePeriod)
        return assetByTimePeriod;
    } catch (error) {
        console.error("Error:", error);
    }
}





function findLastTransactionIndex(stocksByMonth, currentIndex, month) {
    while (stocksByMonth[currentIndex + 1] &&
        stocksByMonth[currentIndex + 1].year <= month.getFullYear() &&
        stocksByMonth[currentIndex + 1].month <= (month.getMonth() + 1)) {
        currentIndex++;
    }
    return currentIndex;
}


async function calculateAssetsValue(stocks, month) {
    let totalValue = 0;

    for (const stock of stocks) {
        let assetPrice = await get_daily_close_price(get_stock_code_by_id(stock.stock_id), month);
        while (assetPrice === 0 || typeof assetPrice !== 'number') {
            month.setDate(month.getDate() - 1);
            assetPrice = await get_daily_close_price(get_stock_code_by_id(stock.stock_id), month);
        }

        totalValue += assetPrice * stock.total_qtd;
    }
    return totalValue;
}


module.exports = { get_daily_close_price, get_period_close_prices, getPortfolioStockDates, get_stock_dividends_in_month, get_stock_price, calculateAssetsValue, calculateDividendsInMonth, get_User_monthly_dividends, getAssetValueByPeriod, findLastTransactionIndex, get_stock_dividends_by_period }