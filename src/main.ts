import './style.css';
import Alpine from 'alpinejs';

// @ts-expect-error
window.Alpine = Alpine;

function getDarkModeLocalStorage() {
  const val = localStorage.getItem('darkMode');
  return val ? JSON.parse(val) : null;
}

function setDarkModeLocalStorage(val: boolean) {
  localStorage.setItem('darkMode', JSON.stringify(val));
}

const startInDarkMode =
  getDarkModeLocalStorage() ??
  !!window?.matchMedia('(prefers-color-scheme: dark)').matches;

Alpine.store('darkMode', {
  on: startInDarkMode,
  toggle(this: { on: boolean }) {
    this.on = !this.on;
    setDarkModeLocalStorage(this.on);
  },
});

Alpine.start();
