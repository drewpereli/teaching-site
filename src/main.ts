import Alpine, { Magics } from 'alpinejs';
import feather, { type FeatherIconNames as FeatherIconName } from 'feather-icons';
import { generateReviewCarouselData, generateReviewLoaderData } from './reviews';
import { getContactFormData } from './contact-form';

// @ts-expect-error -- Add alpine to window so its globally available for debugging.
window.Alpine = Alpine;

function getDarkModeLocalStorage() {
  const val = localStorage.getItem('darkMode');
  return val ? JSON.parse(val) : null;
}

function setDarkModeLocalStorage(val: boolean) {
  localStorage.setItem('darkMode', JSON.stringify(val));
}

const startInDarkMode = getDarkModeLocalStorage() ?? !!window?.matchMedia('(prefers-color-scheme: dark)').matches;

Alpine.store('darkMode', {
  on: startInDarkMode,
  toggle(this: { on: boolean }) {
    this.on = !this.on;
    setDarkModeLocalStorage(this.on);
  },
});

Alpine.store('icons', {
  render(name: FeatherIconName, opts?: Partial<feather.FeatherAttributes>) {
    return feather.icons[name].toSvg(opts);
  },
});

// `forDarkModeOn` is whether the button is to toggle dark mode on or off
Alpine.data('darkModeToggleButton', (forDarkModeOn: boolean) => {
  const icon: FeatherIconName = forDarkModeOn ? 'moon' : 'sun';

  const translateOutClass = forDarkModeOn ? '-translate-y-full' : 'translate-y-full';

  return {
    attrs: {
      ['@click']: '$store.darkMode.toggle()',
      ['x-html']: `$store.icons.render('${icon}')`,
      ['x-show']: `$store.darkMode.on === ${forDarkModeOn}`,
      ['class']: 'absolute duration-500',
      ['x-cloak']: true,
      ['x-transition:enter']: 'transition-[opacity,transform]',
      ['x-transition:enter-start']: `${translateOutClass} opacity-0`,
      ['x-transition:enter-end']: 'translate-y-0 opacity-100',
      ['x-transition:leave']: 'transition-[opacity,transform]',
      ['x-transition:leave-start']: 'translate-y-0 opacity-100',
      ['x-transition:leave-end']: `${translateOutClass} opacity-0`,
    },
  };
});

Alpine.data('reviewLoader', generateReviewLoaderData);
Alpine.data('reviewCarousel', generateReviewCarouselData);

Alpine.data('fadeInAfter', function (this: Magics<unknown>, ms: number) {
  const el = this.$el;
  return {
    attrs: {
      'x-init': async () => {
        el.classList.add('opacity-0');
        await nextTickPromise();
        el.style.transitionDelay = `${ms}ms`;
        el.classList.add('transition-opacity', 'duration-1000');
        el.classList.remove('opacity-0');
      },
    },
  };
});

Alpine.data('contactForm', getContactFormData);

Alpine.start();

async function nextTickPromise() {
  return new Promise<void>((res) => Alpine.nextTick(res));
}
