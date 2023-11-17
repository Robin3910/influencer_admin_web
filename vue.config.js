const {resolve} = require('path')
module.exports = {

  lintOnSave:false,
  runtimeCompiler:true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:9527',
        pathRewrite: {'^/api' : ''}
      }
    }
  },
  chainWebpack(config){
    config.module
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()


  }
}
