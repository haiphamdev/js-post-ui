import postApi from './api/postApi';
import {
  hideModal,
  initPagination,
  initSearch,
  registerModal,
  renderPagination,
  renderPostList,
  toast,
} from './utils';

async function handleFilterChange(filterName, filterValue) {
  try {
    // update query params
    const url = new URL(window.location);
    if (filterName) url.searchParams.set(filterName, filterValue);

    // reset page if needed
    if (filterName === 'title_like') url.searchParams.set('_page', 1);

    history.pushState({}, '', url);

    // fetch API
    // re-render post list
    const { data, pagination } = await postApi.getAll(url.searchParams);
    renderPostList('postList', data);
    renderPagination('pagination', pagination);
  } catch (error) {
    console.log('failed to fetch post list', error);
  }
}

function registerPostDeleteEvent() {
  document.addEventListener('post-delete', (event) => {
    try {
      const modalElement = document.getElementById('modal');
      const post = event.detail;
      const message = `Are you sure to remove post "${post.title}"`;
      registerModal({
        modalId: 'modal',
        titleValue: message,
        deleteSelector: '[data-id="remove"]',
        post,
      });

      const deleteButton = modalElement.querySelector('[data-id="remove"]');
      if (deleteButton)
        deleteButton.addEventListener('click', async () => {
          await postApi.remove(post.id);
          await handleFilterChange();
          toast.success('Remove post successfully');
          hideModal(modalElement);
        });
    } catch (error) {
      console.log('failed to remove post', error);
      toast.error(error.message);
    }
  });
}

// MAIN
(async () => {
  try {
    const url = new URL(window.location);

    // update search params if needed
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

    history.pushState({}, '', url);

    const queryParams = url.searchParams;

    initPagination({
      elementId: 'pagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    });

    initSearch({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    });

    // render post list based URL params
    // const queryParams = new URLSearchParams(window.location.search);
    // const { data, pagination } = await postApi.getAll(queryParams);
    // renderPostList('postList', data);
    // renderPagination('pagination', pagination);
    registerPostDeleteEvent();
    handleFilterChange();

    const loading = document.querySelector('#loader-wrapper');
    if (loading) {
      loading.setAttribute('hidden', '');
    }
  } catch (error) {
    console.log('get all failed', error);
    // show modal, toast error
  }
})();
