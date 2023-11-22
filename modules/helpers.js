import { sendError } from './send.js';

export const readRequestBody = req =>
  new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      resolve(body);
    });

    req.on('error', err => {
      reject(err);
    });
  });

export const validData = (res, data) => {
  if (data.fullName.trim() === '' || !/^([a-zёа-я\s]+)$/i.test(data.fullName)) {
    sendError(res, 400, 'Имя и Фамилия не может содержать цифры');
    return;
  }

  if (data.phone.trim() === '' || data.phone.length !== 10) {
    sendError(res, 400, 'Номер телефона должен быть 10 символов');
    return;
  }

  if (data.ticket.trim() === '' || data.ticket.length !== 8) {
    sendError(res, 400, 'Номер билета должен быть 8 символов');
    return;
  }
};
