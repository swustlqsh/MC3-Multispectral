// module.exports = {
//   // devServer
//   // proxy: Array or Function
//   // 当为函数时接受两个形参[server, proxyMiddleware],
//   // 当为数组时 `path`的设置参考http://expressjs.com/en/4x/api.html#app.use, `config`的设置参考https://www.npmjs.com/package/http-proxy-middleware
//   devServer: {
//     host: '127.0.0.1',
//     port: 5010,
//     // proxy: [ {
//     //   path: [/^\/api/], // your backend url path rules
//     //   config: {
//     //     target: 'http://127.0.0.1:5011',
//     //     changeOrigin: true,
//     //     logLevel: 'debug',
//     //     ws: true
//     //   }
//     // } ]
//   }
// }
module.exports = {
  // devServer
  // proxy: Array or Function
  // 当为函数时接受两个形参[server, proxyMiddleware],
  // 当为数组时 `path`的设置参考http://expressjs.com/en/4x/api.html#app.use, `config`的设置参考https://www.npmjs.com/package/http-proxy-middleware
  devServer: {
    host: '127.0.0.1',
    port: 5010,
    proxy: [ {
      path: [/^\/api/],
      config: {
        target: 'http://127.0.0.1:5011',
        changeOrigin: true,
        logLevel: 'debug',
        ws: true
      }
    } ]
  }
}