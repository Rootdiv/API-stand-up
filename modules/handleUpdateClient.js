import { readFile, writeFile } from 'node:fs/promises';
import { sendData, sendError } from './send.js';
import { CLIENTS } from '../index.js';
import { readRequestBody } from './helpers.js';

export const handleUpdateClient = async (req, res, ticket) => {
  try {
    const body = await readRequestBody(req);
    const updateDataClient = JSON.parse(body);
    if (
      !updateDataClient.fullName ||
      !updateDataClient.phone ||
      !updateDataClient.ticket ||
      !updateDataClient.booking
    ) {
      sendError(res, 400, 'Неверные основные данные');
      return;
    }

    if (!/^([a-zёа-я\s]+)$/i.test(updateDataClient.fullName)) {
      sendError(res, 400, 'Имя и Фамилия не может содержать цифры');
      return;
    }

    if (updateDataClient.phone.length !== 10) {
      sendError(res, 400, 'Номер телефона должен быть 10 символов');
      return;
    }

    if (updateDataClient.ticket.length !== 8) {
      sendError(res, 400, 'Номер билета должен быть 8 символов');
      return;
    }

    if (!updateDataClient.booking?.length || !updateDataClient.booking.every(item => item.comedian && item.time)) {
      sendError(res, 400, 'Неверно заполнены поля бронирования');
      return;
    }

    const clientsData = await readFile(CLIENTS, 'utf-8');
    const clients = JSON.parse(clientsData);

    const clientIndex = clients.findIndex(item => item.ticket === ticket);
    if (clientIndex === -1) {
      sendError(res, 404, 'Клиент с данным номером билета не найден');
      return;
    }

    clients[clientIndex] = { ...clients[clientIndex], ...updateDataClient };

    await writeFile(CLIENTS, JSON.stringify(clients), 'utf-8');
    sendData(res, clients[clientIndex]);
  } catch (error) {
    console.error(`Ошибка при обновлении данных клиента ${error}`);
    sendError(res, 500, 'Ошибка сервера при обновлении данных клиента');
  }
};
