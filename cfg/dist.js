'use strict';

let path = require('path');
let webpack = require('webpack');

let baseConfig = require('./base');
let defaultSettings = require('./defaults');

// Add needed plugins here
let BowerWebpackPlugin = require('bower-webpack-plugin');

let config = Object.assign({}, baseConfig, {
  entry: path.join(__dirname, '../src/index'),
  cache: false,
  devtool: 'sourcemap',
  plugins: [
    new webpack.optimize.DedupePlugin(),  //检测相似文件，合并时去除冗余
    new webpack.DefinePlugin({          //接收字符串插入到代码当中, 所以你需要的话可以写上 JS 的字符串
      'process.env.NODE_ENV': '"production"'
    }),
    new BowerWebpackPlugin({
      searchResolveModulesDirectories: false
    }),
    new webpack.optimize.UglifyJsPlugin(),    //压缩
    new webpack.optimize.OccurenceOrderPlugin(),  //根据模块引用频率，来调整模块顺序，定义模块id，引用频率越高，id越短，增加加载速度
    new webpack.optimize.AggressiveMergingPlugin(), //优化代码，合并相似部分，提取公共部分
    new webpack.NoErrorsPlugin() //保证编译过程不出错
  ],
  module: defaultSettings.getDefaultModules()
});

// Add needed loaders to the defaults here
config.module.loaders.push({
  test: /\.(js|jsx)$/,
  loader: 'babel',
  include: [].concat(
    config.additionalPaths,
    [ path.join(__dirname, '/../src') ]
  )
});

module.exports = config;
