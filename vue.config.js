/*
 * @Author: gooing
 * @since: 2020-02-02 14:59:46
 * @lastTime: 2020-07-14 20:51:58
 * @LastAuthor: Dongzy
 * @FilePath: \pixiciv-pc\vue.config.js
 * @message:
 */
const path = require('path');

// 去console插件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// gzip压缩插件
const CompressionWebpackPlugin = require('compression-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, dir);
}

console.log('Url prefix: ', process.env.VUE_APP_PREFIX);

module.exports = {
  runtimeCompiler: true,
  lintOnSave: false,
  publicPath: process.env.VUE_APP_PREFIX || '/',
  // publicPath: './',

  // 路径别名
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components')); // key,value自行定义，比如.set('@@', resolve('src/components'))
    const oneOfsMap = config.module.rule('less').oneOfs.store;
    oneOfsMap.forEach(item => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          // Provide path to the file with resources
          resources: './src/styles/color.less'

          // Or array of paths
          // resources: ['./path/to/vars.scss', './path/to/mixins.scss']
        })
        .end();
    });
    config.module
      .rule('i18n')
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use('i18n')
      .loader('@kazupon/vue-i18n-loader')
      .end();
  },

  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    disableHostCheck: true, //  新增该配置项
    port: 9000
  },

  css: {
    // // 启用 CSS modules
    // requireModuleExtension: false,
    // // 是否使用css分离插件
    // extract: false,
    // // 开启 CSS source maps?
    // sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      stylus: {
        'resolve url': true
      }
    }
  },

  configureWebpack: config => {
    const devPlugins = [];
    const plugins = [
      new UglifyJsPlugin({
        uglifyOptions: {
          warnings: false,
          drop_debugger: true,
          drop_console: true
        },
        sourceMap: false,
        parallel: true
      }),
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      })
    ];
    config.externals = {
      // vue: 'Vue',
      // 'vue-router': 'window.VueRouter',
      // 'element-ui': 'ElementUI'
      // 其他三方库 ...
    };
    if (process.env.NODE_ENV !== 'development') {
      config.plugins = [...config.plugins, ...plugins];
    } else {
      config.plugins = [...config.plugins, ...devPlugins];
    }
  },

  pluginOptions: {
    i18n: {
      locale: 'zh',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
};
