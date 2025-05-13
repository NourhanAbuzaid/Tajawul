"use client";

import { useState } from "react";
import styles from "@/styles/Translate.module.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HistoryIcon from "@mui/icons-material/History";
import TranslationDropdown from "@/components/ui/MUIdropdown/TranslationDropdown";

export default function Translate() {
  const [fromLanguage, setFromLanguage] = useState("Choose Language");
  const [toLanguage, setToLanguage] = useState("Choose Language");

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
              selectedLanguage={fromLanguage}
              onLanguageSelect={setFromLanguage}
            />
          </div>
          <div className={styles.translateInputContainer}>
            <textarea
              className={styles.translateInput}
              placeholder="Type here..."
            ></textarea>
          </div>
          <div className={styles.translateButtonContainer}>
            <button className={styles.translateButton}>Translate</button>
          </div>
        </div>
        <div className={styles.translateCard}>
          <div className={styles.chooseLanguageContainer}>
            <span className={styles.chooseLanguageText}> To:</span>
            <TranslationDropdown
              selectedLanguage={toLanguage}
              onLanguageSelect={setToLanguage}
            />
          </div>
          <div className={styles.translateOutputContainer}>
            <textarea
              readOnly
              className={styles.translateInput}
              placeholder="Translated text appears here."
            ></textarea>
          </div>
          <div className={styles.translateButtonContainer}></div>
        </div>
      </div>
    </div>
  );
}
