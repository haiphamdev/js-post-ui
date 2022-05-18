import postApi from './api/postApi';

console.log('hello from main.js');

(async () => {
  const queryParams = {
    _page: 1,
    _limit: 5,
  };

  const res = await postApi.getAll(queryParams);
  console.log(res.data);
})();
