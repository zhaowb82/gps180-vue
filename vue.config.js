const path = require('path')

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = {
  // lintOnSave: false,
  assetsDir: 'static',
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://wibim.vicp.net:8089',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api': '/api',
        },
      },
    },
    inline: false,
    disableHostCheck: true,
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: `
          @import "@/assets/styles/index.scss";
        `,
      },
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule('svg')
      .exclude.add(resolve('src/components/zIcon'))
      .end()

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/components/zIcon'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
  },
}
