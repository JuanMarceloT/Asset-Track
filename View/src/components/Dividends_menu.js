import React from "react";
import styles from "./Dividends_menu.module.css";
import ScrollableDivs from "./ScrollableDivs";
import { get_stock_img_by_id, get_stock_name_by_id } from "../bff";

function Dividends_menu({dividends}){
    return (<div className={styles.assetMenu}>
        <ScrollableDivs>
            {dividends != null && (<table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Stock</th>
                        <th>Data</th>
                        <th>Div. per share</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dividends && dividends.map((dividend) => (
                            <tr>
                                <td><img src={get_stock_img_by_id(dividend.stock_id)} alt='logo'></img></td>
                                <td>{get_stock_name_by_id(dividend.stock_id)}</td>
                                <td>March, 2023</td>
                                <td>{dividend.units}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            )}
        </ScrollableDivs>
    </div>)
}

export default Dividends_menu;