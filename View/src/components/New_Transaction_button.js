import React from 'react';
import styles from './New_Transaciton_button.module.css';

function open_new_tranasction_tab(){
    console.log("abriu burro");
}

const New_Transaction_button = () => {
    

        return (
          <>
          <div className={styles.container}>
            <button onClick={open_new_tranasction_tab}>Nova Transação</button>
          </div>
        </>
          );
    
};

export default New_Transaction_button;
