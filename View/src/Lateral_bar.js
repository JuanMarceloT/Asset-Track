import React from 'react';
import styles from './LateralSection.module.css'; // Assuming the CSS file exists

function LateralSection() { // Corrected casing for consistency 
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h1>locura</h1>
        <h2>Dashboard</h2>
        <h2>Portfolio</h2>
        <h2>Tutorial</h2>
      </div>
    </div>
  );
}

export default LateralSection;
