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


@app.route('/stock_period/<string:stock_name>/<string:date>/<string:periodo>', methods=['GET'])
def get_stock_data_period(stock_name, date, periodo):
    try:
        start_date = datetime.strptime(date, '%Y-%m-%d')

        ticker = yf.Ticker(stock_name)
        data = ticker.history(start=start_date, period="1y")

        data_records = data.reset_index().to_dict(orient='records')
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

if __name__ == '__main__':
    app.run(debug=True)
