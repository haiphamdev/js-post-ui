import postApi from './api/postApi';
import { setImage, setTextContent } from './utils/common';

function createPostElement(post) {
  if (!post) return;

  try {
    // find and clone template
    const postTemplate = document.getElementById('postTemplate');
    if (!postTemplate) return;

    const liElement = postTemplate.content.firstElementChild.cloneNode(true);
    if (!liElement) return;

    setTextContent(liElement, '[data-id="title"]', post.title);
    setTextContent(liElement, '[data-id="description"]', post.description);
    setTextContent(liElement, '[data-id="author"]', post.author);

    setImage(liElement, '[data-id="thumbnail"]', post.imageUrl);

    // attach events

    return liElement;
  } catch (error) {
    console.log('failed to create post item', error);
  }
}

function renderPostList(postList) {
  if (!Array.isArray(postList) || postList.length === 0) return;

  const ulElement = document.getElementById('postList');
  if (!ulElement) return;

  postList.forEach((post) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}

(async () => {
  try {
    const queryParams = {
      _page: 1,
      _limit: 6,
    };

    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList(data);
  } catch (error) {
    console.log('get all failed', error);
    // show modal, toast error
  }
})();