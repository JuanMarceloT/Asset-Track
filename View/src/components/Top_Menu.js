import React, { useState } from 'react';
import styles from './Top_Menu.module.css';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={styles.app}>
      <header className={styles.topMenu}>
        <div className={styles.logoContainer}>
            <h1>ASSETTRACK</h1>
        </div>
        <div className={styles.userContainer}>
          <span className={styles.userText}>Hello guest,</span>
          <div className={styles.profileMenu} onClick={toggleMenu}>
            <img src="https://icons.veryicon.com/png/o/miscellaneous/youyinzhibo/guest.png" alt="Guest" className={styles.profilePic} />
            <span className={`${styles.arrow} ${isMenuOpen ? styles.arrowDown : ''}`}>▼</span>
          </div>
          {isMenuOpen && (
            <div className={styles.dropdownMenu}>
              <div className={styles.menuItem}>Profile</div>
              <div className={styles.menuItem}>My account</div>
              <div className={styles.menuItem}>Logout</div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
