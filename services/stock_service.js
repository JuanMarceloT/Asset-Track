const { all } = require("../controller/main");
const { formatStockTimePeriod, compare_string_yyyy_mm_dd_dates, convertToDate } = require("../utils/date_utils");
const { get_stock_code_by_id } = require("../utils/stocks_hash_map");
const { get_daily_close_price, get_period_close_prices, get_stock_dividends_by_period } = require("./data_service");

const isProdEnv = process.env.RUN_MODE === 'prod';
const isDevEnv = process.env.RUN_MODE === 'dev';

let Stocks_aggregated;

if (isProdEnv || isDevEnv) {
    console.log("Loading repository");
    ({ Stocks_aggregated } = require("../repo/repository"));
} else {
    console.log("Loading memrepository");
    ({ Stocks_aggregated } = require("../repo/memrepository"));
}

async function get_User_dividends(user_id) {
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
                let month = (date.getMonth() + 1).toString();
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
                        total_earned: 0,
                        stocks: {}
                    };
                }

                if (!final[year]['months'][month]["days"][day][stock.stock_id]) {
                    let units = getStockQtdbyDate(stocks_units, stock.stock_id, date);

                    final[year]['months'][month]["days"][day]['stocks'][stock.stock_id] = {
                        div_per_share: dividends[key],
                        total_div: dividends[key] * units
                    };
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
        return stocks_dates;
    } catch (ex) {
        console.error("Error:", ex);
    }
}


async function getPortfolioStockUnits(user_id) {
    const stocks_units = {};

    try {
        const stocksByTimePeriod = await Stocks_aggregated(user_id);

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

            if (stocks.length == 0) {
                stocks_units[actual_date] = {};
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

    for (const [current_date, units] of Object.entries(stocks_units)) {
        if (compare_string_yyyy_mm_dd_dates(date, current_date)) {
            last_date = [current_date, units];
        }
    }

    let stock_qtd = 0;

    if (last_date) {
        stock_qtd = last_date[1][stock_id] ?? 0;
    }

    return stock_qtd;
}

async function get_prices_by_timeperiod(stock_code, time_period) {
    switch (time_period) {
        case "1d":
            return await get_period_close_prices(stock_code, "1d", "30m");
        case "7d":
            return await get_period_close_prices(stock_code, "5d", "1d");
        case "1m":
            return await get_period_close_prices(stock_code, "1mo", "1d");
        case "6m":
            return await get_period_close_prices(stock_code, "6mo", "1d");
        case "ytd":
            return await get_period_close_prices(stock_code, "ytd", "5d");
        case "1y":
            return await get_period_close_prices(stock_code, "1y", "5d");
        case "5y":
            return await get_period_close_prices(stock_code, "5y", "1wk");
        case "max":
            return await get_period_close_prices(stock_code, "max", "3mo");
    }
    return {};
}

let base_date_cache = {};

async function get_base_date(time_period) {


    if(!time_period){
        throw error("Undefined argument");
    }

    let assetByTimePeriod = {};
    if (base_date_cache[time_period]) {
        return base_date_cache[time_period];
    }

    let base_date = await get_prices_by_timeperiod(get_stock_code_by_id(6), time_period);
    base_date && base_date.forEach(stock => {
        let date = new Date(stock.Date);
        let formated_date = formatStockTimePeriod(time_period, date);
        assetByTimePeriod[formated_date] = 0;
    });

    base_date_cache[time_period] = assetByTimePeriod;

    return assetByTimePeriod
}
async function getAssetValueByPeriod(user_id, time_period) {
    let assetByTimePeriod = {};

    try {
        const stocks_prices = await getPortfolioStockDates(user_id);
        const stocks_units = await getPortfolioStockUnits(user_id);

        assetByTimePeriod = structuredClone(await get_base_date(time_period));
        // console.log(stocks_units);
        for (const transaction_date of stocks_prices) {
            stock_price = await get_prices_by_timeperiod(get_stock_code_by_id(transaction_date.stock_id), time_period);
            stock_price && stock_price.map(stock => {
                let date = new Date(stock.Date);
                let formated_date = formatStockTimePeriod(time_period, date);
                // console.log(formated_date + " " + getStockQtdbyDate(stocks_units, transaction_date.stock_id, stock.Date) + " " + get_stock_name_by_id(transaction_date.stock_id));
                assetByTimePeriod[formated_date] += +stock.Close.toFixed(2) * getStockQtdbyDate(stocks_units, transaction_date.stock_id, stock.Date);
            });
        }

        if (time_period == "1d") {
            return assetByTimePeriod;
        }

        return sortByDate(assetByTimePeriod);
    } catch (error) {
        console.error("Error:", error);
    }
}



async function get_index_percent(index, time_period) {
    const base_date = structuredClone(await get_base_date(time_period));
    const IndexValue = await get_prices_by_timeperiod("^BVSP", time_period);
    
    if (IndexValue) {
        IndexValue.forEach(stock => {
            const stockDate = new Date(stock.Date);
            const formattedStockDate = formatStockTimePeriod(time_period, stockDate);
            base_date[formattedStockDate] += parseFloat(stock.Close.toFixed(2));
        });
    }
    
    let initialValue = null;
    Object.keys(base_date).forEach(date => {
        const currentAssetValue = base_date[date];
        
        if (initialValue === null && currentAssetValue === 0) {
            base_date[date] = null;
        }
        
        if (initialValue === null) {
             initialValue = currentAssetValue;
             base_date[date] = 0;
            } else {
                if (currentAssetValue !== 0) {
                    base_date[date] = ((initialValue / currentAssetValue) - 1) * -100;
                }
            }
        });
        
        // console.log(base_date);
        return base_date;
    }
    
async function getAssetPercentByPeriod(user_id, time_period) {
    let values = await getAssetValueByPeriod(user_id, time_period);

    let first = 0;

    Object.keys(values).forEach(date => {

        if (!first && values[date] == 0) {
            values[date] = null;
        }

        if (!first) {
            first = values[date];
            values[date] = 0;
        } else {
            if (values[date] != 0) {
                values[date] = ((first / values[date]) - 1) * -100;
            }

        }
    })

    // const entries = Object.entries(values);

    // const lastZeroKey = entries
    //     .filter(([key, value]) => value === 0)
    //     .map(([key]) => key)
    //     .pop();

    // const filteredData = Object.fromEntries(
    //     entries.filter(([key, value]) => value !== 0 || key === lastZeroKey)
    // );

    return values;
}



async function getDividendValueByPeriod(user_id, time_period) {
    // If the time period is daily, return the result early
    if (time_period === "1d") {
        return {};
    }

    try {
        // Fetch portfolio stock prices and units
        const stocks_prices = await getPortfolioStockDates(user_id);
        const stocks_units = await getPortfolioStockUnits(user_id);
        // Clone the base dates for the given time period
        let base = structuredClone(await get_base_date(time_period));
        let initial_date = convertToDate(Object.keys(base)[0]);

        let all_dividends = {};

        // Loop through stock prices and accumulate dividends
        for (const transaction of stocks_prices) {
            let end_date = transaction.end_date ? new Date(transaction.end_date) : new Date();

            if (initial_date >= end_date) continue; // Skip if the initial date is past the end date

            // Get dividends for the stock within the time period
            let dividends = await get_stock_dividends_by_period(
                get_stock_code_by_id(transaction.stock_id),
                initial_date,
                end_date
            );

            // Multiply dividends by stock quantity at each date
            Object.keys(dividends).forEach(date => {
                let quantity = getStockQtdbyDate(stocks_units, transaction.stock_id, date);
                dividends[date] *= quantity;
            });

            // Merge the calculated dividends into the accumulated dividends
            all_dividends = mergeAndSum(dividends, all_dividends);
        }

        // Accumulate the dividend values over time
        all_dividends = accumulateValues(all_dividends);

        let all_dividends_dates = Object.keys(all_dividends);
        let index = 0;
        let previous_value = 0;

        // Iterate through base dates and apply accumulated dividends
        Object.keys(base).forEach(date => {
            let formatted_date = convertToDate(date);

            base[date] = previous_value; // Start with the last known dividend value

            // Update the base value if the dividend date is before or equal to the current base date
            while (index < all_dividends_dates.length && new Date(all_dividends_dates[index]) <= formatted_date) {
                base[date] = all_dividends[all_dividends_dates[index]];
                previous_value = all_dividends[all_dividends_dates[index]];
                index++;
            }
        });

        return base;
    } catch (error) {
        console.error("Error:", error);
        throw error; // Re-throw the error for external handling if necessary
    }
}


const accumulateValues = (data) => {
    let accumulatedSum = 0;

    // Sort the entries by date
    return Object.fromEntries(
        Object.entries(data)
            .sort((a, b) => new Date(a[0]) - new Date(b[0]))
            .map(([date, value]) => {
                // Accumulate the value
                accumulatedSum += value;
                // Return the date and the accumulated sum
                return [date, accumulatedSum];
            })
    );
};

const mergeAndSum = (target, source) => {
    const result = target;

    for (const [key, value] of Object.entries(source)) {
        if (key in result) {
            result[key] += value;
        } else {
            result[key] = value;
        }
    }

    // Sort by date
    return Object.fromEntries(
        Object.entries(result).sort((a, b) => {
            const [dateA] = a;
            const [dateB] = b;
            return new Date(dateA) - new Date(dateB);
        })
    );
};

const sortByDate = (entries) => {
    return Object.fromEntries(
        Object.entries(entries).sort((a, b) => {
            const [dateA] = a;
            const [dateB] = b;

            const [dayA, monthA, yearA] = dateA.split('/');
            const [dayB, monthB, yearB] = dateB.split('/');

            const dateStrA = `${yearA.padStart(4, '0')}${monthA.padStart(
                2,
                '0'
            )}${dayA.padStart(2, '0')}`;
            const dateStrB = `${yearB.padStart(4, '0')}${monthB.padStart(
                2,
                '0'
            )}${dayB.padStart(2, '0')}`;

            return dateStrA.localeCompare(dateStrB);
        })
    );
};

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


module.exports = { calculateAssetsValue, get_User_dividends, get_index_percent, getAssetPercentByPeriod, getAssetValueByPeriod, findLastTransactionIndex, getPortfolioStockDates, get_base_date, getDividendValueByPeriod }