import { setTextContent } from './common';

function showModal(modalElement) {
  // make sure bootstrap script is loaded

  if (!window.bootstrap) return;

  const modal = new window.bootstrap.Modal(modalElement);

  if (modal) modal.show();
}

export function hideModal(modalElement) {
  // make sure bootstrap script is loaded

  if (!window.bootstrap) return;

  const modal = bootstrap.Modal.getInstance(modalElement, {
    backdrop: 'static',
  });

  modal.hide();
}

export function registerModal({ modalId, titleValue, deleteSelector, post }) {
  const modalElement = document.getElementById(modalId);

  if (!modalElement) return;

  // if (Boolean(modalElement.dataset.registered)) return;

  const deleteButton = modalElement.querySelector(deleteSelector);

  if (!deleteButton) return;

  setTextContent(modalElement, '[data-id="title"]', titleValue);

  // deleteButton.addEventListener('click', async (e) => {
  //   // await postApi.remove(post.id);
  //   // hideModal(modalElement);
  // });

  showModal(modalElement);

  // modalElement.dataset.registered = 'true';
}
