import React from "react";
import styles from "../index.module.scss";

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, children }) => (
  <button className={`${styles["tab-button"]} ${active ? styles["active"] : ""}`} onClick={onClick}>
    <span className={styles["tab-icon"]}>{icon}</span>
    <span className={styles["tab-text"]}>{children}</span>
  </button>
);
