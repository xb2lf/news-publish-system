/*
 * @Author: {baixiao}
 * @Date: 2022-10-19 00:01:26
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-19 00:08:40
 * @Description: 
 */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      pathRewrite: { '^/api': '' }
    })
  );
}