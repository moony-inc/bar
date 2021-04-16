export const debounce = function debounce(func, wait, immediate) { // eslint-disable-line
  let timeout;

  return function wrapper(...args) {
    const context = this;
    const later = function later() {
      timeout = null;

      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };
};
