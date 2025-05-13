"use client";

import { useState } from "react";
import styles from "@/styles/Translate.module.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HistoryIcon from "@mui/icons-material/History";
import TranslationDropdown from "@/components/ui/MUIdropdown/TranslationDropdown";

export default function Translate() {
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  return (
    <div className={styles.container}>
      <div className={styles.buttonsContainer}>
        <button className={styles.actionsButton}>
          <FavoriteBorderIcon />
          Favorites
        </button>
        <button className={styles.actionsButton}>
          <HistoryIcon />
          History
        </button>
      </div>
      <div className={styles.translateInputsContainer}>
        <div className={styles.translateCard}>
          <div className={styles.chooseLanguageContainer}>
            <span className={styles.chooseLanguageText}> From:</span>
            <TranslationDropdown
              selectedLanguage={selectedLanguage}
              onLanguageSelect={setSelectedLanguage}
            />
          </div>
        </div>
        <div className={styles.translateCard}>
          <div className={styles.chooseLanguageContainer}>
            <span className={styles.chooseLanguageText}> To:</span>
            <TranslationDropdown
              selectedLanguage={selectedLanguage}
              onLanguageSelect={setSelectedLanguage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
