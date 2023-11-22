import { readFile, writeFile } from 'node:fs/promises';
import { sendData, sendError } from './send.js';
import { CLIENTS } from '../index.js';
import { readRequestBody, validData } from './helpers.js';

export const handleAddClient = async (req, res) => {
  try {
    const body = await readRequestBody(req);
    const newClient = JSON.parse(body);

    if (!newClient.fullName || !newClient.phone || !newClient.ticket || !newClient.booking) {
      sendError(res, 400, 'Неверные основные данные');
      return;
    }

    validData(res, newClient);

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
