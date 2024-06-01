import React, { useEffect, useRef } from 'react';

import styles from './Dashboard_Section.module.css';
import ScrollableDivs from './components/ScrollableDivs';
import Graph from './components/graph';
import Balance_Card from './components/Balance_Card';
import Simple_stock_card from './components/Simple_stock_card';
function Dashboard_Section ({graph, stocks}) {
    return <>  
        <div className={styles.container}>
            <div className={styles.graph}>
            <Graph Params={graph}/>
            </div>
            <div className={styles.stocks}>
            <Balance_Card/>
            <ScrollableDivs>
                <Simple_stock_card/>
                <Simple_stock_card/>
                <Simple_stock_card/>
                <Simple_stock_card/>
                <Simple_stock_card/>
            </ScrollableDivs>
            </div>
        </div>
    </>
};


/*

<div className={styles.stocks}>
            <h1>Stocks</h1>
            <ScrollableDivs maxHeight={50}>
                <StocksCard stocks={stocks}/>
            </ScrollableDivs>  
            <New_Transaction_button/>  
            </div>




*/

export default Dashboard_Section;

