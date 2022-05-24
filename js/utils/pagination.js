export function renderPagination(elementId, pagination) {
  const ulPagination = document.getElementById(elementId);
  if (!pagination || !ulPagination) return;
  let prevPage = -1;

  // calc totalPages
  const { _page, _limit, _totalRows } = pagination;
  const totalPages = Math.ceil(_totalRows / _limit);

  if (_page < 1 || _page > totalPages) return [0, -1, -1, -1, 0];

  if (_page === 1) prevPage = 1;
  else if (_page === totalPages) prevPage = _page - 2 > 0 ? _page - 2 : 1;
  else prevPage = _page - 1;

  const currPage = prevPage + 1 > totalPages ? -1 : prevPage + 1;
  const nextPage = prevPage + 2 > totalPages ? -1 : prevPage + 2;

  // save page and totalPages to ulPagination
  ulPagination.dataset.page = _page;
  ulPagination.dataset.totalPages = totalPages;

  // check if enable/disable prev links
  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled');
  else ulPagination.firstElementChild?.classList.remove('disabled');

  // check if enable/disable next links
  if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled');
  else ulPagination.lastElementChild?.classList.remove('disabled');

  return [
    _page === 1 || _page === 1 ? 0 : _page - 1,
    prevPage,
    currPage,
    nextPage,
    _page === totalPages || totalPages === _page ? 0 : _page + 1,
  ];
}

export function initPagination({ elementId, defaultParams, onChange }) {
  // bind click event for prev/next link
  const ulPagination = document.getElementById(elementId);
  if (!ulPagination) return;

  // set current active page
  // TODO: use default params
  const pageItems = ulPagination.querySelectorAll('.page-item');
  if (pageItems.length === 5) {
    pageItems.forEach((item, idx) => {
      const pageLink = item.querySelector('.page-link');
      if (pageLink) {
        pageLink.href = `?_page=${idx}&_limit=${defaultParams.get('_limit')}`;

        if (idx > 0 && idx < 4) {
          pageLink.textContent = idx;
        }
      }

      if (idx > 0 && idx < 4 && pageLink.textContent === defaultParams.get('_page')) {
        item.classList.add('active');
      }
    });

    ulPagination.removeAttribute('hidden');
  }

  // add click event for prev link
  const prevLink = ulPagination.firstElementChild?.firstElementChild;
  if (prevLink) {
    prevLink.addEventListener('click', (e) => {
      e.preventDefault();
      const page = Number.parseInt(ulPagination.dataset.page) || 1;
      if (page > 1) onChange?.(page - 1);
    });
  }

  // add click event for next link
  const nextLink = ulPagination.lastElementChild?.lastElementChild;
  if (nextLink) {
    nextLink.addEventListener('click', (e) => {
      e.preventDefault();
      const page = Number.parseInt(ulPagination.dataset.page) || 1;
      const totalPages = ulPagination.dataset.totalPages;
      if (page < totalPages) onChange?.(page + 1);
    });
  }
}
