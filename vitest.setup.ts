import '@testing-library/jest-dom';

// Polyfill pointer capture APIs used by Radix UI components in tests
Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', {
  value: () => false,
});
Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', {
  value: () => {},
});
Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', {
  value: () => {},
});

// jsdom does not implement scrollIntoView which Radix uses
Element.prototype.scrollIntoView = () => {};
