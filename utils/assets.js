// Helper for resolving static asset URLs hosted on S3.
const config = require('./config.js');

function resolveAsset(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;

  const normalized = path.startsWith('/') ? path : `/${path}`;
  const base = (config && config.assetBase) || '';
  if (!base) return normalized;

  return `${String(base).replace(/\/$/, '')}${normalized}`;
}

module.exports = {
  resolveAsset,
};
