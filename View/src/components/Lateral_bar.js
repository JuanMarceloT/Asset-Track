import React from 'react';
import styles from './LateralSection.module.css'; // Assuming the CSS file exists

function LateralSection() { // Corrected casing for consistency 
  return (
    <div className={styles.container}>
      <h2>Asset Track</h2>
      <div className={styles.textContainer}>
        <h2>User panel</h2>
      <div className={styles.options}>
        <h2>Dashboard</h2>
        <h2>Portfolio</h2>
        <h2>Research</h2>
        <h2>Dashboard</h2>
      </div>
      </div>
    </div>
  );
}

export default LateralSection;
