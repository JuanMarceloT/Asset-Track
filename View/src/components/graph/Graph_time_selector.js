import React, { useState } from 'react';
import '../../config.js';// Import the global configuration here
import styles from './Graph_time_selector.module.css';

const Graph_time_selector = ({ onSelectTimePeriod ,SetonSelectTimePeriod }) => {
  const [selectedPeriod, setSelectedPeriod] = useState(onSelectTimePeriod);

  const handleClick = (period) => {
    setSelectedPeriod(period);
    SetonSelectTimePeriod(period);
  };

  return (
    <div className={styles.container}>
      {/* <button
        className={selectedPeriod === '1d' ? styles.selected : styles.btn}
        onClick={() => handleClick('1d')}
      >
        1D
      </button> */}
      <button
        className={selectedPeriod === '7d' ? styles.selected : styles.btn}
        onClick={() => handleClick('7d')}
      >
        7D
      </button>
      <button
        className={selectedPeriod === '1m' ? styles.selected : styles.btn}
        onClick={() => handleClick('1m')}
      >
        1M
      </button>
      <button
        className={selectedPeriod === '6m' ? styles.selected : styles.btn}
        onClick={() => handleClick('6m')}
      >
        6M
      </button>
      <button
        className={selectedPeriod === 'ytd' ? styles.selected : styles.btn}
        onClick={() => handleClick('ytd')}
      >
        YTD
      </button>
      <button
        className={selectedPeriod === '1y' ? styles.selected : styles.btn}
        onClick={() => handleClick('1y')}
      >
        1Y
      </button>
      <button
        className={selectedPeriod === '5y' ? styles.selected : styles.btn}
        onClick={() => handleClick('5y')}
      >
        5Y
      </button>

    </div>
  );
};

export default Graph_time_selector;
