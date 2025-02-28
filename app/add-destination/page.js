import NavBar from "@/components/ui/NavBar";
import styles from "@/forms.module.css";

export default function AddDestination() {
  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.frameBackground}>
        <img
          src="/arabic-typo-pattern.svg"
          alt="Arabic Typography Pattern"
          className={styles.svgPattern}
        />
        <div className={styles.formFrame}>
          <p className={styles.title}>Add </p>
        </div>
      </div>
    </div>
  );
}
