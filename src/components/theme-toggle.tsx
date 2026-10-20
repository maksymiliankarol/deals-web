const ThemeToggle = () => {
  function toggleTheme() {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  }

  return ( 
    <button onClick={toggleTheme}>
      Toggle
    </button>
   );
}
 
export default ThemeToggle;