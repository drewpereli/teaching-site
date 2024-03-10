import './style.css';
import Alpine from 'alpinejs';

// @ts-expect-error
window.Alpine = Alpine;

Alpine.store('darkMode', {
  on: !!window?.matchMedia('(prefers-color-scheme: dark)').matches,
  toggle(this: { on: boolean }) {
    this.on = !this.on;
  },
});

Alpine.start();
