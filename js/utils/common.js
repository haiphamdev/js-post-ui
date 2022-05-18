export function setTextContent(parent, selector, text) {
  if (!parent) return;

  const element = parent.querySelector(selector);
  if (element) element.textContent = text;
}

export function setImage(parent, selector, image) {
  if (!parent) return;

  const element = parent.querySelector(selector);
  if (element) element.src = image;
}
