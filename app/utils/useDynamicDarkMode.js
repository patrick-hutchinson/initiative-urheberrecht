import { useState, useEffect } from "react";

/**
 * Hook that decides whether dark-mode should be enabled.
 *
 * Signals we consider:
 * 1. User’s system preference (prefers-color-scheme).
 * 2. A very rough time-of-day heuristic (before 07:00 **or** after 19:00).
 *
 * NOTE: We deliberately removed any geolocation calls so the browser will
 * never prompt for location permission. This also eliminates the SunCalc
 * dependency.
 */
function useDynamicDarkMode() {
  const [systemDarkMode, setSystemDarkMode] = useState(false);
  const [timeDarkMode, setTimeDarkMode] = useState(false);

  // 1. React to system preference changes
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setSystemDarkMode(e.matches);

    // Set initial value
    setSystemDarkMode(query.matches);
    query.addEventListener("change", handleChange);

    return () => query.removeEventListener("change", handleChange);
  }, []);

  // 2. Time-of-day heuristic (local time only ‑ no geolocation)
  useEffect(() => {
    const evaluateTime = () => {
      const hour = new Date().getHours();
      // Consider it "night" between 19:00-06:59
      setTimeDarkMode(hour >= 19 || hour < 7);
    };

    // Evaluate immediately and then every 30 minutes
    evaluateTime();
    const intervalId = setInterval(evaluateTime, 30 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return systemDarkMode || timeDarkMode;
}

export default useDynamicDarkMode;
