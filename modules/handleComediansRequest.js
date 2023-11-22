import { sendData, sendError } from './send.js';

export const handleComediansRequest = async (req, res, comedians, id) => {
  if (id) {
    const comedian = comedians.find(item => item.id === id);
    if (!comedian) {
      sendError(res, 404, 'Стендап комик не найден');
      return;
    }
    sendData(res, comedian);
    return;
  }
  sendData(res, comedians);
};
