const { date_to_yyyy_mm_dd } = require("../utils/date_utils");

const EXTERNAL_SERVICES_URL = process.env.EXTERNAL_SERVICES_URL;

async function get_daily_close_price(stockName, date) {
    try {
        const response = await fetch(`${EXTERNAL_SERVICES_URL}/stock/${stockName}.SA/${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}`);
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
        const response = await fetch(`${EXTERNAL_SERVICES_URL}/stock_last_price/${stockName}.SA/`);
        if (!response.ok) {
            return undefined;
        }
        const data = await response.json();

        return data ?? 0;

    } catch (error) {
        console.error('Error:', error);
    }

}


async function get_interval_close_prices(stockName, initial, end, time_period) {
    try {

        let response;
        if (!end) {
            let current_date = new Date().toISOString().slice(0, 10);
            response = await fetch(`${EXTERNAL_SERVICES_URL}/stock_interval/${stockName}.SA/${initial}/${current_date}/${time_period}`);
        } else {
            response = await fetch(`${EXTERNAL_SERVICES_URL}/stock_interval/${stockName}.SA/${initial}/${end}/${time_period}`);
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

async function get_period_close_prices(stockName, time_period, time_interval) {
    try {
        if(stockName != "^BVSP"){
            stockName += ".SA";
        }
        let response;
        response = await fetch(`${EXTERNAL_SERVICES_URL}/stock_period/${stockName}/${time_period}/${time_interval}`);

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

async function get_stock_dividends_by_period(stock_code, initial_date, end_date) {
    try {
        const response = await fetch(`${EXTERNAL_SERVICES_URL}/dividends_period/${stock_code}.SA/${date_to_yyyy_mm_dd(initial_date)}/${date_to_yyyy_mm_dd(end_date)}`);
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


module.exports = { get_daily_close_price, get_stock_price, get_interval_close_prices, get_period_close_prices, get_stock_dividends_by_period};