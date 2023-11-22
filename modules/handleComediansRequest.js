import { sendData, sendError } from './send.js';

export const handleComediansRequest = async (req, res, comedians, comedianId) => {
  if (segments.length === 2) {
    const comedian = comedians.find(item => item.id === comedianId);
    if (!comedian) {
      sendError(res, 404, 'Стендап комик не найден');
      return;
    }
    sendData(res, comedian);
    return;
  }
  sendData(res, comedians);
};
