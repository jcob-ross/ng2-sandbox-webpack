const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');


//=========================================================
//  ENVIRONMENT VARS
//---------------------------------------------------------
const NODE_ENV = process.env.NODE_ENV;

const ENV_DEVELOPMENT = NODE_ENV === 'development';
const ENV_PRODUCTION = NODE_ENV === 'production';
const ENV_TEST = NODE_ENV === 'test';

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;

const cwd = process.cwd();
var npmRoot = __dirname + "/node_modules";
var appDir = __dirname + "/src";

//=========================================================
//  CONFIG
//---------------------------------------------------------
const config = {};
module.exports = config;


config.resolve = {
  root: [path.resolve(cwd)],
  extensions: ['', '.ts', '.js', 'css', 'json'],
  modulesDirectories: ['node_modules'],
  alias: {
    'app': 'app',
    'scripts': npmRoot
  }
};

config.module = {
  preLoaders: [
    // { test: /\.ts$/, loader: "tslint" }
  ],

  loaders: [
    { test: /\.html$/, loader: 'raw'},
    { test: /^index\.html$/, loader: "file-loader?name=[path][name].[ext]" },

    { test: /\.(png|jpg|gif)$/,   loader: "url-loader?limit=50000&name=[path][name].[ext]" },
    { test: /\.json$/, loader: 'json' },
    { test: /^(?!.*\.min\.css$).*\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap")},

    { test: /\.scss$/, loaders: ['style-loader', 'postcss-loader',
                                  ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap"),
                                  'sass-loader' +
                                  '?outputStyle=expanded&' +
                                  'root='+appDir+'&' +
                                  '&includePaths[]'+npmRoot + '&' +
                                  '&includePaths[]'+appDir
                                ],
      exclude: path.resolve('src/views/common/styles'), include: path.resolve('src/views')
    },
    { test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/,    loader: "url-loader?limit=10000&mimetype=application/font-woff&name=[path][name].[ext]" },
    { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,         loader: "url-loader?limit=10000&mimetype=application/x-font-ttf&name=[path][name].[ext]" },
    { test: /\.eot(\?v=\d+\.\d+\.\d+)?\??$/,      loader: "url-loader?limit=10000&mimetype=application/vnd.ms-fontobject&name=[path][name].[ext]" },
    { test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,         loader: "url-loader?limit=10000&mimetype=application/font-otf&name=[path][name].[ext]" },
    { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,         loader: "url-loader"   },


    {test: /\.ts$/, loader: 'ts', exclude: [ /node_modules\/(?!(ng2-bootstrap))/ ]},
    // {test: /\.scss$/, loader: 'raw!postcss-loader!sass', exclude: path.resolve('src/views/common/styles'), include: path.resolve('src/views')}
  ]
};

config.plugins = [
  new ExtractTextPlugin("styles.css"),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
  })
];

config.postcss = [
  autoprefixer({ browsers: ['last 3 versions', 'Firefox ESR'] })
];

config.sassLoader = {
  outputStyle: 'compressed',
  precision: 10,
  sourceComments: false
};


//=====================================
//  DEVELOPMENT or PRODUCTION
//-------------------------------------
if (ENV_DEVELOPMENT || ENV_PRODUCTION) {
  config.devtool = 'source-map';

  config.entry = {
    main: [
      './src/main'
    ],
    vendor: [
      'core-js/es6/array',
      'core-js/es6/map',
      'core-js/es6/set',
      'core-js/es6/string',
      'core-js/es6/symbol',
      'core-js/es7/reflect',
      'zone.js',
      'angular2/common',
      'angular2/core',
      'angular2/http',
      'angular2/platform/browser',
      'angular2/router',
      'rxjs'
    ]
  };

  config.output = {
    filename: '[name].js',
    path: path.resolve('./dist'),
    publicPath: '/'
  };

  config.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor', filename: 'vendor.js', minChunks: Infinity
    }),
    new CopyWebpackPlugin([
      {from: 'src/assets/vendor.css'},
      {from: 'src/assets/images', to: 'images'}
    ]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      hash: true,
      inject: 'body',
      template: './src/index.html'
    })
  );
}


//=====================================
//  DEVELOPMENT
//-------------------------------------
if (ENV_DEVELOPMENT) {
  config.entry.main.unshift(`webpack-dev-server/client?http://${HOST}:${PORT}`);

  config.module.loaders.push(
    {test: /\.scss$/, loader: 'style!css!postcss-loader!sass', include: path.resolve('src/views/common/styles')}
  );

  config.devServer = {
    contentBase: './src',
    historyApiFallback: true,
    host: HOST,
    outputPath: config.output.path,
    port: PORT,
    publicPath: config.output.publicPath,
    stats: {
      cached: true,
      cachedAssets: true,
      chunks: true,
      chunkModules: false,
      colors: true,
      hash: false,
      reasons: true,
      timings: true,
      version: false
    }
  };
}


//=====================================
//  PRODUCTION
//-------------------------------------
if (ENV_PRODUCTION) {
  config.module.loaders.push(
    {test: /\.scss$/, loader: ExtractTextPlugin.extract('style-loader', '!css!postcss-loader!sass'), include: path.resolve('src/views/common/styles')}
  );

  config.plugins.push(
    new ExtractTextPlugin('styles.css'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: false,
      compress: {
        dead_code: true, // eslint-disable-line camelcase
        screw_ie8: true, // eslint-disable-line camelcase
        unused: true,
        warnings: false
      }
    })
  );
}


//=====================================
//  TEST
//-------------------------------------
if (ENV_TEST) {
  config.devtool = 'inline-source-map';

  config.module.loaders.push(
    {test: /\.scss$/, loader: 'style!css!postcss-loader!sass', include: path.resolve('src/views/common/styles')}
  );
}
