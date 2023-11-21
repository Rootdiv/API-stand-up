import { createServer } from 'node:http';
import { access, readFile, writeFile } from 'node:fs/promises';

const PORT = 2125;

createServer(async (req, res) => {
  try {
    await access('clients.json');
  } catch (err) {
    console.log(err);
    writeFile('clients.json', '[]', 'utf-8');
  }
  if (req.method === 'GET' && req.url === '/comedians') {
    try {
      const data = await readFile('comedians.json', 'utf-8');
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(data);
    } catch (err) {
      res.writeHead(500, {
        'Content-Type': 'text/plain; charset=utf-8',
      });
      res.end(`Ошибка сервер: ${err}`);
    }
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/plain; charset=utf-8',
    });
    res.end('Страница не найдена');
  }
}).listen(PORT);
console.log(`Сервер запущен на http://localhost:${PORT}`);
