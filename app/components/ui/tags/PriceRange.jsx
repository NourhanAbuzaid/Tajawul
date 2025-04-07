import styles from "./PriceRange.module.css";

const PriceRange = ({ low, mid, luxury }) => {
  return (
    <div className={styles.priceRangeContainer}>
      {low && (
        <span className={`${styles.priceRange} ${styles.low}`}>$ Low</span>
      )}
      {mid && (
        <span className={`${styles.priceRange} ${styles.mid}`}>
          $$ - $$$ Mid-Range
        </span>
      )}
      {luxury && (
        <span className={`${styles.priceRange} ${styles.luxury}`}>
          $$$$+ Luxury
        </span>
      )}
    </div>
  );
};

export default PriceRange;
