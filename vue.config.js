const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/web',
  outputDir: 'dist',
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
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
