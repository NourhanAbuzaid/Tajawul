"use client";
import TranslateIcon from "@mui/icons-material/Translate";

export default function TranslationShortcut() {
  return (
    <div className="resizable-btn-frame">
      <button className="resizable-btn">
        <TranslateIcon />
        <span>Translate</span>
      </button>
    </div>
  );
}
