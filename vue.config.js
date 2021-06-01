module.exports = {
  devServer: {
    open: true,
    host: 'localhost',
    port: 8080,
    https: false,
    // 以上的 ip 和端口是我们本机的;下面为需要跨域的
    proxy: {  // 配置跨域
      '/api': {
        target: 'http://81.71.76.91:28080/api/',  // 后台服务器地址
        ws: true,
        changOrigin: true,  // 允许跨域
        pathRewrite: {
          '^/api': ''  // 请求的时候使用这个 api 就可以
        }
      }
    }
  }
}
