import React, { useEffect, useRef } from 'react';

import styles from './Dashboard_Section.module.css';
import ScrollableDivs from './components/ScrollableDivs';
import Selectable_menu from './components/Selectable_menu'
import Graph from './components/graph';

import { useState } from 'react';
import Stock_input from './components/Stock_input';



function Dashboard_Section({ graph, stocks, id, HandleNewTransaction }) {


    return <>
        <div className={styles.container}>
            <div className={styles.graph}>
                <Graph Params={graph} />
            </div>
            <div className={styles.stocks}>
                <div className={styles.menu}>
                    <Selectable_menu id={id} HandleNewTransaction={HandleNewTransaction} stocks={stocks}/>
                </div>

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

