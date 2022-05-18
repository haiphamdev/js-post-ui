import axiosClient from './api/axiosClient';

console.log('hello from main.js');

(async () => {
  const res = await axiosClient.get('/posts');
  console.log(res.data);
})();
