import React, { useEffect } from "react";
import { toast } from "react-toastify";

const DisableRightClick = () => {
  useEffect(() => {
    const handleRightClick = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      if (
        e.key === "F12" || // F12 - Dev Tools
        (e.ctrlKey && e.key === "U") || // Ctrl + U - View Source
        (e.ctrlKey && e.key === "S") || // Ctrl + S - Save Page
        (e.ctrlKey && e.key === "H") || // Ctrl + H - History
        (e.ctrlKey && e.key === "A") || // Ctrl + A - Select All
        (e.ctrlKey && e.key === "P") || // Ctrl + P - Print
        (e.ctrlKey && e.shiftKey && e.key === "I") || // Ctrl + Shift + I - Dev Tools
        (e.ctrlKey && e.shiftKey && e.key === "J") || // Ctrl + Shift + J - Dev Console
        (e.ctrlKey && e.shiftKey && e.key === "C") || // Ctrl + Shift + C - Inspect
        (e.metaKey && e.key === "S") || // CMD + S (Mac Save Page)
        (e.metaKey && e.key === "U") // CMD + U (Mac View Source)
      ) {
        e.preventDefault();
        toast.warn("This action is disabled on this page.");
      }
    };

    // Add event listeners
    document.addEventListener("contextmenu", handleRightClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleRightClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
};

export default DisableRightClick;
