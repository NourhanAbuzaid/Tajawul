"use client";

import { useState } from "react";
import styles from "@/styles/Translate.module.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HistoryIcon from "@mui/icons-material/History";
import ErrorMessage from "@/components/ui/ErrorMessage";
import TranslationDropdown from "@/components/ui/MUIdropdown/TranslationDropdown";
import API from "@/utils/api";
import useAuthStore from "@/store/authStore";
import withAuth from "@/utils/withAuth";

function Translate() {
  const [fromLanguage, setFromLanguage] = useState("Choose Language");
  const [toLanguage, setToLanguage] = useState("Choose Language");
  const [fromLanguageCode, setFromLanguageCode] = useState("");
  const [toLanguageCode, setToLanguageCode] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFromLanguageSelect = (languageName, languageCode) => {
    setFromLanguage(languageName);
    setFromLanguageCode(languageCode);
    setError("");
  };

  const handleToLanguageSelect = (languageName, languageCode) => {
    setToLanguage(languageName);
    setToLanguageCode(languageCode);
    setError("");
  };

  const handleTranslate = async () => {
    if (!fromLanguageCode || !toLanguageCode) {
      setError("Please select both input and output languages");
      return;
    }

    if (!sourceText.trim()) {
      setError("Please enter text to translate");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await API.post("/Translation", {
        sourceText: sourceText,
        inputLanguage: fromLanguageCode,
        outputLanguage: toLanguageCode,
      });

      setTranslatedText(response.data.translatedText);
    } catch (error) {
      console.error("Translation error:", error);
      setError("Translation failed. Please try again.");

      // Handle unauthorized error (token expired)
      if (error.response?.status === 401) {
        useAuthStore.getState().clearAuth();
        window.location.href = "/login";
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTranslate();
    }
  };

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
              onLanguageSelect={handleFromLanguageSelect}
            />
          </div>
          <div className={styles.translateInputContainer}>
            <textarea
              className={styles.translateInput}
              placeholder="Type here..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              onKeyDown={handleKeyDown}
            ></textarea>
          </div>

          <div className={styles.translateButtonContainer}>
            <div className={styles.errorContainer}>
              {error && <ErrorMessage message={error} />}
            </div>
            <button
              className={styles.translateButton}
              onClick={handleTranslate}
              disabled={isLoading}
            >
              {isLoading ? "Translating..." : "Translate"}
            </button>
          </div>
        </div>
        <div className={styles.translateCard}>
          <div className={styles.chooseLanguageContainer}>
            <span className={styles.chooseLanguageText}> To:</span>
            <TranslationDropdown
              selectedLanguage={toLanguage}
              onLanguageSelect={handleToLanguageSelect}
            />
          </div>
          <div className={styles.translateOutputContainer}>
            <textarea
              readOnly
              className={styles.translateInput}
              placeholder="Translated text appears here."
              value={translatedText}
            ></textarea>
          </div>
          <div className={styles.translateButtonContainer}></div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Translate);
