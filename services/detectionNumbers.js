const api = require('../utils/api.js');

// 获取用户的检测号列表
async function getUserDetectionNumbers() {
  return await api.get('/api/detection-codes');
}

// 验证检测号是否有效（需携带手机号 phone）
async function validateDetectionNumber(detectionCode, phone) {
  return await api.post('/api/detection-codes/verify', {
    detection_code: detectionCode,
    phone
  });
}

// 使用检测号（标记为已使用）
async function useDetectionNumber(detectionNumber) {
  return await api.post('/api/detection-numbers/use', {
    detection_number: detectionNumber
  });
}

// 获取检测号详情
async function getDetectionNumberDetails(detectionNumber) {
  return await api.get(`/api/detection-numbers/${encodeURIComponent(detectionNumber)}`);
}

module.exports = {
  getUserDetectionNumbers,
  validateDetectionNumber,
  useDetectionNumber,
  getDetectionNumberDetails
};
