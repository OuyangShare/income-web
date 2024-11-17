const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/web',
  outputDir: 'dist',
  configureWebpack: {
    output: {
      filename: `js/[name].[contenthash].[chunkhash:8].js`,
      chunkFilename: `js/[name].[contenthash].[chunkhash:8].js`
    }
  },
  css: {
    extract: {
      filename: `css/[name].[contenthash].[chunkhash:8].css`,
      chunkFilename: `css/[name].[contenthash].[chunkhash:8].css`
    }
  }
})
