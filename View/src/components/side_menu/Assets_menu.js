import React , {useState} from "react";
import ScrollableDivs from "../cards/ScrollableDivs";
import Simple_stock_card from "../cards/Simple_stock_card";
import PlusButton from "../cards/PlusButton";
import StockInput from "./Stock_input";

import styles from './Assets_menu.module.css';

function Assets_menu({stocks, id, setReload, stock_prices, stock_infos}){



  const [IsTabMenu, setIsTabMenu] = useState(1);
  if (!IsTabMenu) { 
    return (<div className={styles.stockinput}>
      <button className={styles.closeButton} onClick={() => {
        setIsTabMenu(!IsTabMenu);
      }}>X</button>
      <StockInput user_id={id} setReload={setReload} stock_infos={stock_infos} />
    </div>
    );
  }


    return (<div className={styles.assetMenu}>
      <div className={styles.stocks}>
        <ScrollableDivs>
          {
            stocks && stocks.map((stock) => (
              <Simple_stock_card key={stock.stock_id} stock={stock} stock_prices={stock_prices[stock.stock_id]} />
            ))
          }
        </ScrollableDivs>
        </div>
        <div className={styles.button}>
          <PlusButton state={IsTabMenu} setState={setIsTabMenu} />
        </div>
      </div>)

}

export default React.memo(Assets_menu);