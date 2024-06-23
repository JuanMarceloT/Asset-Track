import React from 'react';
import styles from './Top_Cards.module.css'; 


function Top_Cards({children}) {
  return (
    <div className={styles.container}>
      {children}
    </div>
    
  );
}

export default Top_Cards;
