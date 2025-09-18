const api = require('../utils/api.js');

// 获取用户的检测号列表
async function getUserDetectionNumbers() {
  return await api.get('/api/detection-codes');
}

// 验证并绑定检测号（需携带手机号 phone）
// 标准化规则：去除短横线并转为大写，保持与后端邮寄接口一致
async function validateDetectionNumber(detectionCode, phone) {
  const normalized = String(detectionCode || '').replace(/-/g, '').toUpperCase();
  return await api.post('/api/detection-codes/verify-bind', {
    detection_number: normalized,
    phone
  });
}

module.exports = {
  getUserDetectionNumbers,
  validateDetectionNumber
};
