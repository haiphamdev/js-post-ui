import dayjs from 'dayjs';
import postApi from './api/postApi';
import { setBackgroundImage, setTextContent } from './utils';

function renderPostDetail(post) {
  if (!post) return;

  setTextContent(document, '#postDetailTitle', post.title);
  setTextContent(document, '#postDetailDescription', post.description);
  setTextContent(document, '#postDetailAuthor', post.author);
  setTextContent(
    document,
    '#postDetailTimeSpan',
    dayjs(post.updateAt).format(' - DD/MM/YYYY HH:mm')
  );

  setBackgroundImage(document, 'postHeroImage', post.imageUrl);

  // render edit page link
  const editPageLink = document.getElementById('goToEditPageLink');
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${post.id}`;
    editPageLink.innerHTML = '<i class="fas fa-edit"></i> Edit Post';
  }
}

(async () => {
  // get post id from URL
  // fetch post detail API
  // render post detail
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');
    if (!postId) {
      console.log('Post not found');
      return;
    }

    const post = await postApi.getById(postId);
    renderPostDetail(post);
  } catch (error) {
    console.log('failed to fetch post detail', error);
  }
})();
