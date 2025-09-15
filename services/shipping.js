const api = require('../utils/api.js');

// 创建邮寄通知（确认邮寄）
// payload: { detection_number, courier_company, tracking_no, shipped_at? }
async function createShippingNotification(payload) {
  return await api.post('/api/shipping-notifications', payload);
}

module.exports = {
  createShippingNotification
};

