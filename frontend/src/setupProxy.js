const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use('/api', createProxyMiddleware({
        target: 'http://localhost:5254/api',
        changeOrigin: true,
    }));

    app.use('/hubs', createProxyMiddleware({
        target: 'http://localhost:5254/hubs',
        changeOrigin: true,
        ws: true,
    }));
}