import { readFile } from 'node:fs/promises';
import { CLIENTS } from '../index.js';
import { sendData, sendError } from './send.js';

export const handleClientsRequest = async (req, res, ticket) => {
  try {
    const clientsData = await readFile(CLIENTS, 'utf-8');
    const clients = JSON.parse(clientsData);
    const client = clients.find(item => item.ticket === ticket);
    if (!client) {
      sendError(res, 404, 'Клиент с данным номером билета отсутствует');
      return;
    }
    sendData(res, client);
  } catch (error) {
    console.error(`Ошибка при обработке запроса: ${error}`);
    sendError(res, 500, 'Ошибка сервера при обработке запроса клиента');
  }
};
