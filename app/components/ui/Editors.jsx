import React from "react";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import styles from "./Editors.module.css";

const Editors = ({ editors }) => {
  return (
    <div className={styles.container}>
      <AvatarGroup max={5}>
        {editors.map((editor) => (
          <Avatar key={editor.id} alt={editor.name} src={editor.url} />
        ))}
      </AvatarGroup>
      <span className={styles.important}>Edited By</span>
      <span className={styles.names}>
        {editors.map((editor) => editor.name).join(", ")}
      </span>
    </div>
  );
};

export default Editors;
