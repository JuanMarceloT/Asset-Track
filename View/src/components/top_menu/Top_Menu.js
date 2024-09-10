import React, { useState } from 'react';
import '../../config.js';// Import the global configuration here
import styles from './Top_Menu.module.css';

function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  

  return (
    <div className={styles.app}>
      <header className={styles.topMenu}>
        <div className={styles.logoContainer}>
            {MountainIcon()}
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
