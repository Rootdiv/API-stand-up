import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { sendError } from './modules/send.js';
import { checkFile } from './modules/checkFile.js';
import { handleComediansRequest } from './modules/handleComediansRequest.js';
import { handleAddClient } from './modules/handleAddClient.js';
import { handleClientsRequest } from './modules/handleClientsRequest.js';
import { handleUpdateClient } from './modules/handleUpdateClient.js';

const PORT = 2125;
const COMEDIANS = './comedians.json';
export const CLIENTS = './clients.json';

const startServer = async () => {
  if (!(await checkFile(COMEDIANS))) {
    return;
  }

  await checkFile(CLIENTS, true);

  createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const segments = req.url.split('/').filter(Boolean);

    try {
      const comediansData = await readFile(COMEDIANS, 'utf-8');
      const comedians = JSON.parse(comediansData);

      if (req.method === 'GET' && segments[0] === 'comedians') {
        handleComediansRequest(req, res, comedians, segments[1]);
        return;
      }

      if (req.method === 'POST' && segments[0] === 'clients') {
        handleAddClient(req, res);
        return;
      }

      if (req.method === 'GET' && segments[0] === 'clients' && segments.length === 2) {
        handleClientsRequest(req, res, segments[1]);
        return;
      }

      if (req.method === 'PATCH' && segments[0] === 'clients' && segments.length === 2) {
        handleUpdateClient(req, res, segments[1]);
        return;
      }

      sendError(res, 404, 'Страница не найдена');
      return;
    } catch (error) {
      sendError(res, 500, `Ошибка сервера: ${error}`);
      return;
    }
  }).listen(PORT);
  console.log(`Сервер запущен на http://localhost:${PORT}`);
};

startServer();
