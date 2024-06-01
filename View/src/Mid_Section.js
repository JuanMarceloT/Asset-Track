import React from 'react';
import styles from './midsection.module.css'; 
import LateralSection from './components/Lateral_bar';




function MidSection({ children }) {
    return (
      <div className={styles.container}>
        <div className={styles.lateralSection}>
          <LateralSection />
        </div>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    );
  }

export default MidSection;
