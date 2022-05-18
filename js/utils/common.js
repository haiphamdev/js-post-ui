export function setTextContent(parent, selector, text) {
  if (!parent) return;

  const element = parent.querySelector(selector);
  if (element) element.textContent = text;
}

export function setImage(parent, selector, image) {
  if (!parent) return;

  const element = parent.querySelector(selector);
  if (element) {
    element.src = image;

    element.addEventListener('error', () => {
      element.src = 'https://via.placeholder.com/1368x400?text=thumbnail';
    });
  }
}

export function setBackgroundImage(parent, selector, image) {
  if (!parent) return;

  const element = parent.getElementById(selector);
  if (element) {
    element.style.backgroundImage = `url(${image})`;

    element.addEventListener('error', () => {
      element.src = 'https://via.placeholder.com/1368x400?text=thumbnail';
    });
  }
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength - 1)}…`;
}
