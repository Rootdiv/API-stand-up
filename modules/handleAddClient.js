import { readFile, writeFile } from 'node:fs/promises';
import { sendData, sendError } from './send.js';
import { CLIENTS } from '../index.js';
import { readRequestBody } from './helpers.js';

export const handleAddClient = async (req, res) => {
  try {
    const body = await readRequestBody(req);
    const newClient = JSON.parse(body);

    if (!newClient.fullName || !newClient.phone || !newClient.ticket || !newClient.booking) {
      sendError(res, 400, 'Неверные основные данные');
      return;
    }

    if (!/^([a-zёа-я\s]+)$/i.test(newClient.fullName)) {
      sendError(res, 400, 'Имя и Фамилия не может содержать цифры');
      return;
    }

    if (newClient.phone.length !== 10) {
      sendError(res, 400, 'Номер телефона должен быть 10 символов');
      return;
    }

    if (newClient.ticket.length !== 8) {
      sendError(res, 400, 'Номер билета должен быть 8 символов');
      return;
    }

    if (!newClient.booking?.length || !newClient.booking.every(item => item.comedian && item.time)) {
      sendError(res, 400, 'Неверно заполнены поля бронирования');
      return;
    }

    const clientsData = await readFile(CLIENTS, 'utf-8');
    const clients = JSON.parse(clientsData);
    clients.push(newClient);
    await writeFile(CLIENTS, JSON.stringify(clients), 'utf-8');
    sendData(res, newClient);
  } catch (error) {
    console.error(`Ошибка при добавлении клиента ${error}`);
    sendError(res, 500, 'Ошибка сервера при чтении запроса');
  }
};
