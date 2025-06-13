"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/Translate.module.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HistoryIcon from "@mui/icons-material/History";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ErrorMessage from "@/components/ui/ErrorMessage";
import TranslationDropdown from "@/components/ui/MUIdropdown/TranslationDropdown";
import API from "@/utils/api";
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
  const [isFavorite, setIsFavorite] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [translationId, setTranslationId] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [historyItems, setHistoryItems] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

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
      setIsFavorite(response.data.isFavorite || false);
      setTranslationId(response.data.translationId); // Store the translationId
    } catch (error) {
      console.error("Translation error:", error);
      setError("Translation failed. Please try again.");
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

  const handleCopy = () => {
    if (!translatedText) return;

    navigator.clipboard
      .writeText(translatedText)
      .then(() => {
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const toggleFavorite = async () => {
    if (!translationId) return;

    try {
      await API.patch("/Translation/toggle-favorite", {
        translationItemId: translationId,
      });
      setIsFavorite((prev) => !prev);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setError("Failed to update favorite status");
    }
  };

  // Fetch history when showHistory changes
  useEffect(() => {
    if (showHistory) {
      fetchHistory();
    }
  }, [showHistory]);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await API.get("/Translation?SortDescending=true");
      setHistoryItems(response.data);
    } catch (error) {
      console.error("Error fetching history:", error);
      setError("Failed to load history");
    } finally {
      setHistoryLoading(false);
    }
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const clearHistory = async () => {
    try {
      await API.delete("/Translation");
      setHistoryItems([]);
    } catch (error) {
      console.error("Error clearing history:", error);
      setError("Failed to clear history");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttonsContainer}>
        <button className={styles.actionsButton}>
          <FavoriteBorderIcon />
          Favorites
        </button>
        <button
          className={`${styles.actionsButton} ${
            showHistory ? styles.activeButton : ""
          }`}
          onClick={toggleHistory}
        >
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
            <div className={styles.textareaButtons}>
              <button
                className={styles.copyButton}
                onClick={handleCopy}
                disabled={!translatedText}
                aria-label="Copy translation"
              >
                {showCopied && (
                  <span className={styles.copiedText}>Copied!</span>
                )}
                <ContentCopyIcon sx={{ fontSize: 20 }} />
              </button>
              <button
                className={`${styles.favoriteButton} ${
                  isFavorite ? styles.favoriteActive : ""
                }`}
                onClick={toggleFavorite}
                disabled={!translatedText}
                aria-label={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                {isFavorite ? (
                  <FavoriteIcon
                    sx={{
                      fontSize: 20,
                      color: "var(--Green-Hover)",
                      transition: "color 0.3s ease",
                    }}
                  />
                ) : (
                  <FavoriteBorderIcon
                    sx={{
                      fontSize: 20,
                      transition: "color 0.3s ease",
                    }}
                  />
                )}
              </button>
            </div>
          </div>
          <div className={styles.translateButtonContainer}></div>
        </div>
      </div>
      {showHistory && (
        <div className={styles.historyContainer}>
          <div className={styles.historyHeader}>
            <h1>History</h1>
            <div className={styles.historyControls}>
              <div className={styles.historyPagination}>
                <span>
                  1-{historyItems.length} of {historyItems.length} phrases
                </span>
              </div>
              <button className={styles.clearButton} onClick={clearHistory}>
                Clear all History
              </button>
            </div>
          </div>

          {historyLoading ? (
            <div className={styles.loading}>Loading history...</div>
          ) : (
            <div className={styles.historyContent}>
              <div className={styles.historyHeaderRow}>
                <div className={styles.historyCell}>From → To</div>
                <div className={styles.historyCell}>Original Text</div>
                <div className={styles.historyCell}>Translated Text</div>
                <div className={styles.historyCell}>Date</div>
              </div>

              {historyItems.map((item) => (
                <div key={item.translationId} className={styles.historyRow}>
                  <div className={styles.historyCell}>
                    {item.inputLanguage} → {item.outputLanguage}
                  </div>
                  <div className={styles.historyCell}>{item.sourceText}</div>
                  <div className={styles.historyCell}>
                    {item.translatedText}
                  </div>
                  <div className={styles.historyCell}>
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default withAuth(Translate);
