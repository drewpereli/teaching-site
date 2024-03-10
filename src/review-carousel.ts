import { setIntervalPausable, debounced } from './async-task-helpers';

const reviews = [
  {
    name: 'Aaron',
    review:
      'This was my first session using TakeLessons. Drew was very knowledgeable, patient and easy going. Highly recommended!',
  },
  {
    name: 'Kyle',
    review:
      "Drew kept me interested and engaged. I have a lot of respect for someone this caring and patient. Can't wait to see Drew again.",
  },
  {
    name: 'Susan',
    review:
      'Drew kept me engaged and explained concepts very thoroughly. Good sense of humor and kept me confident in my abilities. Will be scheduling another appointment.',
  },
  {
    name: 'Will',
    review:
      'Drew was great! Super knowledgeable and very patient with someone who had a lot of questions. 5 Stars!',
  },
  {
    name: 'Tyson',
    review:
      'Outstanding. Drew is very knowledgeable and helpful. Booking more lessons as we speak!',
  },
  {
    name: 'Dae',
    review:
      'Drew explains concepts very clearly and is a great teacher! I have learned a ton from him.',
  },
  {
    name: 'Maddie',
    review:
      "Drew is very knowledgeable and also so down to earth. I find his lessons very helpful in getting a better grasp of what I'm learning.",
  },
];

type ReviewCarouselData = {
  reviews: typeof reviews;
  currentIdx: number;
  next(this: ReviewCarouselData): void;
  previous(this: ReviewCarouselData): void;
  onClickNext(this: ReviewCarouselData): void;
  onClickPrevious(this: ReviewCarouselData): void;
  onLoad(this: ReviewCarouselData): void;
  getTransformProp(this: ReviewCarouselData): string;
  cardWidth: number;
  gap: number;
  // Determines how big the window is compared to the cards.
  // If it's 1, the window is the same width as the cards.
  // If it's 2, the window is twice as wide as the cards, so half a card on each side of the current card will be shown, etc etc.
  windowScale: number;
  windowWidth: number;
  windowGap: number;
  pause(): void;
  resumeDebounced(): void;
};

export function generateReviewCarouselData(): ReviewCarouselData {
  return {
    reviews,
    currentIdx: 1,
    next() {
      const nextIdx = (this.currentIdx + 1) % this.reviews.length;
      this.currentIdx = nextIdx;
    },
    previous() {
      const prevIdx =
        (this.currentIdx - 1 + this.reviews.length) % this.reviews.length;
      this.currentIdx = prevIdx;
    },
    onClickNext() {
      this.pause();
      this.next();
      this.resumeDebounced();
    },
    onClickPrevious() {
      this.pause();
      this.previous();
      this.resumeDebounced();
    },
    onLoad() {
      const { pause, resume } = setIntervalPausable(this.next.bind(this), 5000);
      this.pause = pause;
      this.resumeDebounced = debounced(resume, 5000);
    },
    getTransformProp() {
      const val =
        -this.currentIdx * (this.cardWidth + this.gap) + this.windowGap;
      return `translateX(${val}px)`;
    },
    cardWidth: 240,
    gap: 16,
    windowScale: 1.65,
    get windowWidth() {
      return this.cardWidth * this.windowScale;
    },
    get windowGap() {
      return (this.windowWidth - this.cardWidth) / 2;
    },
    pause() {},
    resumeDebounced() {},
  };
}
