const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const appDevBuild = resolveApp('devBuild');

const WriteFilePlugin = require('write-file-webpack-plugin');


module.exports = function({ env }) {
  return {
    webpack: {
      alias: {},
      plugins: [],
      configure: (webpackConfig, { env, paths }) => {
        return webpackConfig;
      }
    },
    plugins: [
      {
        plugin: {
          overrideWebpackConfig: ({
            webpackConfig,
            cracoConfig,
            pluginOptions,
            context: { env, paths }
          }) => {
            console.log('ENV', env);
            if (env === 'development') {
              webpackConfig.output.path = appDevBuild;
              webpackConfig.output.futureEmitAssets = false;
              webpackConfig.plugins.unshift(new WriteFilePlugin());            
              console.log('overrideWebpackConfig: ', webpackConfig);
            }
            return webpackConfig;
          }
        },
        options: {}
      }
    ]
  }
};
