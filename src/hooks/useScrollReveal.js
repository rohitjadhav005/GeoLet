import { useEffect } from "react";

export default function useScrollReveal() {
  useEffect(() => {
    // If mobile, don't run the reveal observer to save CPU/battery and eliminate scroll lag
    if (window.innerWidth <= 768) {
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.15, // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
        } else {
          entry.target.classList.remove("reveal-visible");
        }
      });
    }, observerOptions);

    // Find all elements with reveal classes
    const revealElements = document.querySelectorAll(
      ".reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur"
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []); // Run once on mount
}
