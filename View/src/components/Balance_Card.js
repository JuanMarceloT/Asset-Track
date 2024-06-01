import React, { useEffect, useRef } from 'react';

import styles from './Balance_Card.module.css';

function Balance_Card () {
    var balance = "R$ 2.500,00";
    var invested = "R$ 1.750,00";
    var aumento = "+2.5%";
    return <>  
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>Balance</h1>
                <div className={styles.balance}>
                    <p id={styles.balance_num}>{balance}</p>
                    <p id={styles.variacao}>{aumento}</p>
                </div>
            </div>
            <div className={styles.card}>
                <h1>invested</h1>
                <div className={styles.invested}>
                    <p>{invested}</p>
                    <button>opa</button>
                </div>
            </div>
        </div>
    </>
};


export default Balance_Card;

