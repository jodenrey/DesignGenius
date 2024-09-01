'use client';

import { useState, useEffect } from 'react';
import styles from './PageTransition.module.css';

const PageTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Trigger the transition when the component mounts
    setIsTransitioning(true);
    setShowContent(false);

    const transitionDuration = 1000; // Duration of the transition in milliseconds

    // Show content after the transition color has faded out
    const timer = setTimeout(() => {
      setIsTransitioning(false);
      setShowContent(true);
    }, transitionDuration);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <div className={`${styles.transitionOverlay} ${isTransitioning ? styles.active : ''}`} />
      {showContent && <div className={styles.content}>{/* The content goes here */}</div>}
    </div>
  );
};

export default PageTransition;
