"use client";

import Image from "next/image";
import NavBar from "./components/ui/NavBar";
import styles from "@/home.module.css";

export default function Home() {
  return (
    <div>
      <NavBar />
      <div className={styles.container}>
        <main>
          <div className={styles.coverWrapper}>
            <div className={styles.mainCover}>
              <Image
                src="/Egypt.jpg"
                alt="Luxor, Egypt"
                fill={true}
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          </div>
          <div className={styles.sectionBelowImage}> </div>
        </main>
      </div>
    </div>
  );
}
