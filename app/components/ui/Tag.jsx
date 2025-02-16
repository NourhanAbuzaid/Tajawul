import styles from "./Tag.module.css";

const Tag = ({ text, color }) => {
  return <span className={`${styles.tag} ${styles[color]}`}>{text}</span>;
};

export default Tag;
