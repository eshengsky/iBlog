// 系统当前是否是深色模式
let darkModeEnabled = false;
if (window.matchMedia) {
  darkModeEnabled = window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// 上一次使用的是否是深色模式
const lastIsDarkMode = !!localStorage.getItem('dark-mode');

// 定时查找元素是否已生成，以避免闪屏
const timer = requestAnimationFrame(() => {
  const container = document.body;
  if (container) {
    cancelAnimationFrame(timer);
    if (darkModeEnabled || lastIsDarkMode) {
      container.classList.remove('light-mode');
      container.classList.add('dark-mode');
      container.classList.add('dark-notransition');
      container.classList.add('dark-expaned');
    } else {
      container.classList.remove('dark-mode');
      container.classList.add('light-mode');
    }
  }
});
