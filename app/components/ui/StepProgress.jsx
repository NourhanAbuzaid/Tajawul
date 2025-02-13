"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./StepProgress.module.css";

const steps = [
  { id: "step-one-about", label: "About" },
  { id: "step-two-social", label: "Social Media" },
  { id: "step-three-interests", label: "Travelling Interests" },
];

const StepProgress = ({ completedSteps = [] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentStep, setCurrentStep] = useState("");

  useEffect(() => {
    if (pathname) {
      setCurrentStep(pathname.split("/").pop());
    }
  }, [pathname]);

  const navigateToStep = (stepId) => {
    router.push(`/complete-your-profile/${stepId}`);
  };

  return (
    <div className={styles.progressContainer}>
      {steps.map((step, index) => (
        <div key={step.id} className={styles.stepWrapper}>
          {index > 0 && <div className={styles.stepLine} />}{" "}
          {/* Add line between steps */}
          <div
            className={`${styles.step} ${
              currentStep === step.id ? styles.active : ""
            } ${completedSteps.includes(step.id) ? styles.completed : ""}`}
            onClick={() => navigateToStep(step.id)}
          >
            {completedSteps.includes(step.id) ? "✔" : index + 1}{" "}
            {/* Number or ✓ */}
          </div>
          <span className={styles.stepLabel}>{step.label}</span>{" "}
          {/* Step name below */}
        </div>
      ))}
    </div>
  );
};

export default StepProgress;
