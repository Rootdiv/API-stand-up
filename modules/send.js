export const sendData = (res, data) => {
  res.writeHead(200, {
    'Content-Type': 'application/json; charset=utf-8',
  });
  res.end(JSON.stringify(data));
};

export const sendError = (res, statusCode, message) => {
  res.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
  });
  res.end(message);
};
