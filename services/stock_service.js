async function get_daily_close_price(stockName, date) {
    return 1;
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

async function get_period_close_prices() {
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

async function calculateDividendsInMonth(stocks, month) {
    let Dividends = {};
    let total_Dividends = 0;

    for (const stock of stocks) {
        let stock_dividends_in_month = await get_stock_dividends_in_month(Get_Stock_Code(stock.stock_id), month);
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
    const DividendsByMonth = [];

    try {
        const stocksByMonth = await Stocks_aggregated_by_month(user_id);
        const monthsSince = getLastWeekdaysSince(stocksByMonth[0].month, stocksByMonth[0].year);
        let currentIndex = 0;

        for (const month of monthsSince) {
            currentIndex = findLastTransactionIndex(stocksByMonth, currentIndex, month);
            const Dividends = await calculateDividendsInMonth(stocksByMonth[currentIndex].stocks, month);

            DividendsByMonth.push({
                year: month.getFullYear(),
                month: month.getMonth() + 1,
                Dividends: Dividends
                /*{
                  total_Dividends: 200,
                  stocks: {
                    ITUB4: {
                      dividends_per_share: 12,
                      total_Dividends: 100,
                    },
                    PETR4: {
                      dividends_per_share: 12,
                      total_Dividends: 100,
                    }
                  }
                }
                */
            });
        }
        //console.log(DividendsByMonth);
        return DividendsByMonth;
    } catch (error) {
        console.error("Error:", error);
    }
}


async function getMonthlyAsset(user_id, time_period) {
    const assetByTimePeriod = [];

    try {
        const stocksByTimePeriod = await Stocks_aggregated_by_month(user_id);
        const monthsSince = getLastWeekdaysSince(stocksByTimePeriod[0].month, stocksByTimePeriod[0].year);
        let currentIndex = 0;

        for (const month of monthsSince) {
            currentIndex = findLastTransactionIndex(stocksByTimePeriod, currentIndex, month);
            const assetsValue = await calculateAssetsValue(stocksByTimePeriod[currentIndex].stocks, month);

            assetByTimePeriod.push({
                year: month.getFullYear(),
                month: month.getMonth() + 1,
                assets_value: assetsValue
            });
        }

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
        let assetPrice = await get_daily_close_price(Get_Stock_Code(stock.stock_id), month);
        while (assetPrice === 0 || typeof assetPrice !== 'number') {
            month.setDate(month.getDate() - 1);
            assetPrice = await get_daily_close_price(Get_Stock_Code(stock.stock_id), month);
        }

        totalValue += assetPrice * stock.total_qtd;
    }
    return totalValue;
}
