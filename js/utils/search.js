import debounce from 'lodash.debounce';

// Pure function - dump function
export function initSearch({ elementId, defaultParams, onChange }) {
  const searchInput = document.getElementById(elementId);
  if (!searchInput) return;

  // set default values from query params
  // title_like
  // const queryParams = new URLSearchParams(window.location.search);
  if (defaultParams.get('title_like')) {
    searchInput.value = defaultParams.get('title_like');
  }

  const debounceSearch = debounce((event) => onChange?.(event.target.value), 500);

  searchInput.addEventListener('input', debounceSearch);
}
