const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: '/',
  transpileDependencies: true,
  devServer:{
    client:{
      overlay:false,
    },
  }
})
