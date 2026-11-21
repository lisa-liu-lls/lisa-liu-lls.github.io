  if (localStorage.getItem('theme') === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }
  const toggleBtn = document.getElementById('theme-toggle');
  const toggleText = document.getElementById('toggle-text');
  const toggleIcon = document.getElementById('toggle-icon');
  function updateToggleUI() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    toggleText.textContent = isLight ? 'Dark Mode' : 'Light Mode';
    toggleIcon.textContent = isLight ? '🌙' : '☀️';
  }
  updateToggleUI();
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
      updateToggleUI();
    });
  }
