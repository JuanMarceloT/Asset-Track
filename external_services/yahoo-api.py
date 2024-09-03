from flask import Flask, jsonify
import yfinance as yf
from datetime import datetime, timedelta
import calendar

app = Flask(__name__)

@app.route('/stock/<string:stock_name>/<string:date>', methods=['GET'])
def get_stock_data(stock_name, date):
    start_date = datetime.strptime(date, '%Y-%m-%d')
    end_date = start_date + timedelta(days=1)
    ticker = yf.Ticker(stock_name)
    data = ticker.history(start=start_date.strftime('%Y-%m-%d'), end=end_date.strftime('%Y-%m-%d'))
    return jsonify(data.to_dict(orient='records'))

@app.route('/stock_last_price/<string:stock_name>/', methods=['GET'])
def get_stock_last_price(stock_name):
    ticker = yf.Ticker(stock_name)
    last_price = ticker.history(period='1d')['Close'].iloc[-1]
    return jsonify(last_price)




@app.route('/stock_interval/<string:stock_name>/<string:inital_date>/<string:final_date>/<string:interval>', methods=['GET'])
def get_stock_data_interval(stock_name, inital_date, final_date, interval):
    try:
        start_date = datetime.strptime(inital_date, '%Y-%m-%d')
        end_date = datetime.strptime(final_date, '%Y-%m-%d')

        ticker = yf.Ticker(stock_name)

        data = ticker.history(start=start_date, end=end_date, interval=interval)

        data_records = data.reset_index().to_dict(orient='records')
        for record in data_records:
            record['Date'] = record['Date'].strftime('%Y-%m-%d')
        
        return jsonify(data_records)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/stock_period/<string:stock_name>/<string:period>/<string:interval>', methods=['GET'])
def get_stock_data_period(stock_name, period, interval):
    try:

        ticker = yf.Ticker(stock_name)

        data = ticker.history(period=period, interval=interval)

        data_records = data.reset_index().to_dict(orient='records')

        #   this is intraday case
        if period == '1d':
            for record in data_records:
                record['Datetime'] = record['Datetime'].strftime("%a, %d %b %Y %H:%M:%S %Z")
        else:
            for record in data_records:
                record['Date'] = record['Date'].strftime('%Y-%m-%d')
        
        
        return jsonify(data_records)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/dividends/<string:stock_name>/<string:date>', methods=['GET'])
def get_dividends_month(stock_name, date):
    # Get the ticker and dividends data
    ticker = yf.Ticker(stock_name)
    dividends = ticker.dividends
    
    try:
        # Convert date to datetime object
        month = datetime.strptime(date, '%Y-%m')
        
        # Filter dividends data for the specified month
        filtered_dividends = dividends[(dividends.index.year == month.year) & (dividends.index.month == month.month)]
        
        # Convert the filtered dividends to a dictionary with string keys
        filtered_dividends_dict = {str(k): v for k, v in filtered_dividends.items()}
        
        # Print the filtered dividends (for debugging)
        print(filtered_dividends_dict)
        
        # Return the filtered dividends as JSON
        return jsonify(filtered_dividends_dict)
    except KeyError:
        # If there are no dividends for the specified date, return an empty JSON response
        return jsonify({})

@app.route('/dividends_period/<string:stock_name>/<string:ini_date>/<string:final_date>', methods=['GET'])
def get_dividends_by_period(stock_name, ini_date, final_date):
    # Get the ticker and dividends data
    ticker = yf.Ticker(stock_name)
    dividends = ticker.dividends
    
    try:
        # Filter dividends data for the specified month
        filtered_dividends = dividends[(dividends.index >= ini_date) & (dividends.index <= final_date)]

        # Convert the filtered dividends to a dictionary with string keys
        filtered_dividends_dict = {str(k): v for k, v in filtered_dividends.items()}
        
        # Print the filtered dividends (for debugging)
        print(filtered_dividends_dict)
        
        # Return the filtered dividends as JSON
        return jsonify(filtered_dividends_dict)
    except KeyError:
        # If there are no dividends for the specified date, return an empty JSON response
        return jsonify({})

if __name__ == '__main__':
    app.run(debug=True)
