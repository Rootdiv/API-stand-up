import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { sendError } from './modules/send.js';
import { checkFileExist, createFileIfNotExist } from './modules/checkFile.js';
import { handleComediansRequest } from './modules/handleComediansRequest.js';
import { handleAddClient } from './modules/handleAddClient.js';
import { handleClientsRequest } from './modules/handleClientsRequest.js';
import { handleUpdateClient } from './modules/handleUpdateClient.js';

const PORT = 2125;
const COMEDIANS = './comedians.json';
export const CLIENTS = './clients.json';

const startServer = async () => {
  if (!(await checkFileExist(COMEDIANS))) {
    return;
  }

  await createFileIfNotExist(CLIENTS);

  createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const [resource, id] = req.url.split('/').filter(Boolean);

    try {
      const comediansData = await readFile(COMEDIANS, 'utf-8');
      const comedians = JSON.parse(comediansData);

      if (req.method === 'GET' && resource === 'comedians') {
        handleComediansRequest(req, res, comedians, id);
        return;
      }

      if (req.method === 'POST' && resource === 'clients') {
        handleAddClient(req, res);
        return;
      }

      if (req.method === 'GET' && resource === 'clients' && id) {
        handleClientsRequest(req, res, id);
        return;
      }

      if (req.method === 'PATCH' && resource === 'clients' && id) {
        handleUpdateClient(req, res, id);
        return;
      }

      sendError(res, 404, 'Данные не найдены');
      return;
    } catch (error) {
      console.log(`Ошибка на сервера ${error}`);
      sendError(res, 500, 'Произошла ошибка на сервере');
      return;
    }
  }).listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
  });
};

startServer();

/* server.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Порт ${port} занят, пробуем запустить на порту ${port + 1}`);
    startServer(port + 1);
  }
}); */
