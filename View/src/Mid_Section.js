import React from 'react';
import styles from './midsection.module.css';



function MidSection({ children }) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    );
  }

export default MidSection;
