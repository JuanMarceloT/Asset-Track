import React from 'react';
import styles from './midsection.module.css'; 
import LateralSection from './Lateral_bar';




function MidSection({ data }) {
    return (
      <div className={styles.container}>
        <div className={styles.lateralSection}>
          <LateralSection />
        </div>
        <div className={styles.graph}>
          <h2>{data}</h2>
        </div>
        <div className={styles.balance}>
        </div>
      </div>
    );
  }

export default MidSection;
