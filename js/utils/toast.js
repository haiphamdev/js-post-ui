import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export const toast = {
  info(message) {
    Toastify({
      text: message,
      duration: 5000,
      gravity: 'top',
      position: 'right',
      close: true,
      style: {
        background: 'linear-gradient(to right, #00b09b, #96c93d)',
      },
    }).showToast();
  },

  success(message) {
    Toastify({
      text: message,
      duration: 5000,
      gravity: 'top',
      position: 'right',
      close: true,
      style: {
        background: '#81c784',
      },
    }).showToast();
  },

  error(message) {
    Toastify({
      text: message,
      duration: 5000,
      gravity: 'top',
      position: 'right',
      close: true,
      style: {
        background: '#e57373',
      },
    }).showToast();
  },
};
