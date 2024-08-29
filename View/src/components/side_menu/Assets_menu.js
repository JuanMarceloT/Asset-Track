import React , {useState} from "react";
import ScrollableDivs from "../cards/ScrollableDivs";
import Simple_stock_card from "../cards/Simple_stock_card";
import PlusButton from "../cards/PlusButton";
import StockInput from "../cards/Stock_input";

import styles from './Assets_menu.module.css';

function Assets_menu({stocks, HandleNewTransaction, id}){



  const [IsTabMenu, setIsTabMenu] = useState(1);
  if (!IsTabMenu) { 
    return (<div className={styles.stockinput}>
      <button className={styles.closeButton} onClick={() => {
        setIsTabMenu(!IsTabMenu);
      }}>X</button>
      <StockInput user_id={id} HandleNewTransaction={HandleNewTransaction} />
    </div>
    );
  }


    return (<div className={styles.assetMenu}>
      <div className={styles.stocks}>
        <ScrollableDivs>
          {
            stocks && stocks.map((stock) => (
              <Simple_stock_card stock={stock} />
            ))
          }
        </ScrollableDivs>
        </div>
        <div className={styles.button}>
          <PlusButton state={IsTabMenu} setState={setIsTabMenu} />
        </div>
      </div>)

}

export default Assets_menu;