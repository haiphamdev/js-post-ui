import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { setImage, setTextContent, truncateText } from './common';

dayjs.extend(relativeTime);

export function createPostElement(post) {
  if (!post) return;

  // find and clone template
  const postTemplate = document.getElementById('postTemplate');
  if (!postTemplate) return;

  const liElement = postTemplate.content.firstElementChild.cloneNode(true);
  if (!liElement) return;

  setTextContent(liElement, '[data-id="title"]', post.title);
  setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100));
  setTextContent(liElement, '[data-id="author"]', post.author);
  setTextContent(liElement, '[data-id="timeSpan"]', ` - ${dayjs(post.updateAt).fromNow()}`);

  setImage(liElement, '[data-id="thumbnail"]', post.imageUrl);

  // attach events
  // go to post detail when click on div.post-item
  const divElement = liElement.firstElementChild;
  if (divElement) {
    divElement.addEventListener('click', (event) => {
      // S2: if event is trigger from menu --> ignore
      const menu = liElement.querySelector('[data-id="menu"]');
      if (menu && menu.contains(event.target)) return;

      window.location.assign(`/post-detail.html?id=${post.id}`);
    });
  }

  // add click event for edit button
  const editButton = liElement.querySelector('[data-id="edit"]');
  if (editButton) {
    editButton.addEventListener('click', (e) => {
      // S1: prevent event bubbling to parent
      // e.stopPropagation();
      window.location.assign(`/add-edit-post.html?id=${post.id}`);
    });
  }

  return liElement;
}

export function renderPostList(elementId, postList) {
  if (!Array.isArray(postList)) return;

  const ulElement = document.getElementById(elementId);
  if (!ulElement) return;

  // clear current list
  ulElement.textContent = '';

  postList.forEach((post) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}
