const freezeBackground = () => {
  // Prevent scrolling on both html and body to stop background scroll
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
};

const unfreezeBackground = () => {
  // Re-enable scrolling on both html and body
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
};

export { freezeBackground, unfreezeBackground };
