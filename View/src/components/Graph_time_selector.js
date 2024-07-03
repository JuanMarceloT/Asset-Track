import React, { useState } from 'react';

const Graph_time_selector = ({ onSelectTimePeriod ,SetonSelectTimePeriod }) => {
  const [selectedPeriod, setSelectedPeriod] = useState(onSelectTimePeriod);

  const handleClick = (period) => {
    setSelectedPeriod(period);
    SetonSelectTimePeriod(period);
  };

  return (
    <div>
      <button
        className={selectedPeriod === '1d' ? 'selected' : ''}
        onClick={() => handleClick('1d')}
      >
        1D
      </button>
      <button
        className={selectedPeriod === '7d' ? 'selected' : ''}
        onClick={() => handleClick('7d')}
      >
        7D
      </button>
      <button
        className={selectedPeriod === '1m' ? 'selected' : ''}
        onClick={() => handleClick('1m')}
      >
        1M
      </button>
      <button
        className={selectedPeriod === '6m' ? 'selected' : ''}
        onClick={() => handleClick('6m')}
      >
        6M
      </button>
      <button
        className={selectedPeriod === 'ytd' ? 'selected' : ''}
        onClick={() => handleClick('ytd')}
      >
        YTD
      </button>
      <button
        className={selectedPeriod === '1y' ? 'selected' : ''}
        onClick={() => handleClick('1y')}
      >
        1Y
      </button>
      <button
        className={selectedPeriod === '5y' ? 'selected' : ''}
        onClick={() => handleClick('5y')}
      >
        5Y
      </button>
      <style jsx>{`
        .selected {
          background-color: #007bff;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default Graph_time_selector;
