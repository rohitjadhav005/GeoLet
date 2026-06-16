import { useEffect } from "react";

export default function useScrollReveal() {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.15, // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          // Optional: Stop observing once revealed so it doesn't animate out and in again
          observer.unobserve(entry.target);
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
