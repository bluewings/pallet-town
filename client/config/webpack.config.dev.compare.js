import path from 'path';
import webpack from 'webpack';
import extend from 'extend';
import AssetsPlugin from 'assets-webpack-plugin';
import nodeExternals from 'webpack-node-externals';

const isDebug = !process.argv.includes('--release');
const isVerbose = process.argv.includes('--verbose');

//
// Common configuration chunk to be used for both
// client-side (client.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------

const config = {
  context: path.resolve(__dirname, '../src'),

  output: {
    path: path.resolve(__dirname, '../build/public/assets'),
    publicPath: '/assets/',
    sourcePrefix: '  ',
    pathinfo: isVerbose,
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, '../src'),
        loader: 'babel-loader',
        query: {
          cacheDirectory: isDebug,
          babelrc: false,
          presets: ['react', 'latest', 'stage-0', ...isDebug ? [] : ['react-optimize']],
          plugins: ['transform-runtime', ...!isDebug ? [] : ['transform-react-jsx-source', 'transform-react-jsx-self']],
        },
      },
      {
        test: /\.pug$/,
        exclude: /node_modules/,
        loaders: ['babel?presets[]=es2015&presets[]=react', 'pug-as-jsx'],
      },
      {
        test: /\.css/,
        include: /\/(node_modules|styles)\//,
        loaders: [
          'isomorphic-style-loader',
          `css-loader?${JSON.stringify({ minimize: !isDebug, importLoaders: 1, sourceMap: isDebug, modules: false, localIdentName: '[local]' })}`,
          'postcss-loader?pack=default',
        ],
      },
      {
        test: /\.scss$/,
        include: /\/(node_modules|styles)\//,
        loaders: [
          'isomorphic-style-loader',
          `css-loader?${JSON.stringify({ minimize: !isDebug, importLoaders: 1, sourceMap: isDebug, modules: true, localIdentName: '[local]' })}`,
          'postcss-loader?pack=sass',
          'sass-loader',
        ],
      },
      {
        test: /\.css/,
        exclude: /\/(node_modules|styles)\//,
        loaders: [
          'isomorphic-style-loader',
          `css-loader?${JSON.stringify({ minimize: !isDebug, importLoaders: 1, sourceMap: isDebug, modules: true, localIdentName: isDebug ? '[name]-[local]-[hash:base64:5]' : '[hash:base64:5]' })}`,
          'postcss-loader?pack=default',
        ],
      },
      {
        test: /\.scss$/,
        exclude: /\/(node_modules|styles)\//,
        loaders: [
          'isomorphic-style-loader',
          `css-loader?${JSON.stringify({ minimize: !isDebug, importLoaders: 1, sourceMap: isDebug, modules: true, localIdentName: isDebug ? '[name]-[local]-[hash:base64:5]' : '[hash:base64:5]' })}`,
          'postcss-loader?pack=sass',
          'sass-loader',
        ],
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.yml$/,
        exclude: /node_modules/,
        loaders: ['json', 'yaml'],
      },
      {
        test: /\.txt$/,
        loader: 'raw-loader',
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'url-loader',
        query: { name: isDebug ? 'img/[hash].[ext]' : 'img/[hash].[ext]', limit: 10000 },
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        query: { name: isDebug ? 'img/[hash].[ext]' : 'img/[hash].[ext]', limit: 10000, mimetype: 'image/svg+xml' },
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        // loader: "url?limit=10000&minetype=application/font-woff"
        loader: 'url-loader',
        query: { name: isDebug ? 'fonts/[hash].[ext]' : 'fonts/[hash].[ext]', limit: 10000, mimetype: 'application/font-woff' },
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        query: { name: isDebug ? 'fonts/[hash].[ext]' : 'fonts/[hash].[ext]', limit: 10000, mimetype: 'application/octet-stream' },
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file',
        query: { name: isDebug ? 'fonts/[hash].[ext]' : 'fonts/[hash].[ext]', limit: 10000 },
      },
    ],
  },

  resolve: {
    root: path.resolve(__dirname, '../src'),
    modulesDirectories: ['shared', 'node_modules'],
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json'],
  },

  // Don't attempt to continue if there are any errors.
  bail: !isDebug,

  cache: isDebug,

  debug: isDebug,

  stats: {
    colors: true,
    reasons: isDebug,
    hash: isVerbose,
    version: isVerbose,
    timings: true,
    chunks: isVerbose,
    chunkModules: isVerbose,
    cached: isVerbose,
    cachedAssets: isVerbose,
  },

  // The list of plugins for PostCSS
  // https://github.com/postcss/postcss
  /* eslint-disable global-require */
  postcss(bundler) {
    return {
      default: [
        require('postcss-partial-import')({ addDependencyTo: bundler }),
        require('postcss-url')(),
        require('postcss-custom-properties')(),
        require('postcss-custom-media')(),
        require('postcss-media-minmax')(),
        require('postcss-custom-selectors')(),
        require('postcss-calc')(),
        require('postcss-nesting')(),
        require('postcss-nested')(),
        require('postcss-color-function')(),
        require('pleeease-filters')(),
        require('pixrem')(),
        require('postcss-selector-matches')(),
        require('postcss-selector-not')(),
        require('postcss-flexbugs-fixes')(),
        require('autoprefixer')({ browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'] }),
      ],
      sass: [
        require('autoprefixer')({ browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'] }),
      ],
    };
  },
  /* eslint-enable */
};

//
// Configuration for the client-side bundle (client.js)
// -----------------------------------------------------------------------------

const clientConfig = extend(true, {}, config, {
  entry: {
    client: './client/index.js',
    editor: './client/editor.js',
    viewer: './client/viewer.js',
    embed: './client/embed.js',
  },

  output: {
    filename: isDebug ? '[name].js' : '[name].[chunkhash:8].js',
    chunkFilename: isDebug ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js',
  },

  externals: [
    { './cptable': 'var cptable' },
  ],

  target: 'web',

  plugins: [

    // Define free variables
    // https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isDebug ? '"development"' : '"production"',
      'process.env.BROWSER': true,
      __DEV__: isDebug,
    }),

    // Emit a file with assets paths
    // https://github.com/sporto/assets-webpack-plugin#options
    new AssetsPlugin({
      path: path.resolve(__dirname, '../build'),
      filename: 'assets.js',
      processOutput: x => `module.exports = ${JSON.stringify(x, null, 2)};`,
    }),

    // Move modules that occur in multiple entry chunks to a new entry chunk (the commons chunk).
    // http://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   minChunks: module => /node_modules/.test(module.resource),
    // }),

    ...isDebug ? [] : [
      // Assign the module and chunk ids by occurrence count
      // Consistent ordering of modules required if using any hashing ([hash] or [chunkhash])
      // https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
      new webpack.optimize.OccurrenceOrderPlugin(true),

      // Search for equal or similar files and deduplicate them in the output
      // https://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
      new webpack.optimize.DedupePlugin(),

      // Minimize all JavaScript output of chunks
      // https://github.com/mishoo/UglifyJS2#compressor-options
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true, // React doesn't support IE8
          warnings: isVerbose,
        },
        mangle: {
          screw_ie8: true,
        },
        output: {
          comments: false,
          screw_ie8: true,
        },
      }),
    ],
  ],

  // Choose a developer tool to enhance debugging
  // http://webpack.github.io/docs/configuration.html#devtool
  devtool: isDebug ? 'cheap-module-source-map' : false,

  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  // https://webpack.github.io/docs/configuration.html#node
  // https://github.com/webpack/node-libs-browser/tree/master/mock
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
});

//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------

const serverConfig = extend(true, {}, config, {
  entry: {
    server: './server/index.js',
  },

  output: {
    filename: '../../server.js',
    libraryTarget: 'commonjs2',
  },

  externals: [
    /^\.\/assets$/,
    nodeExternals({ whitelist: [/\.(pug|css|less|scss)/] }),
  ],

  target: 'node',

  plugins: [
    // Define free variables
    // https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isDebug ? '"development"' : '"production"',
      'process.env.BROWSER': false,
      __DEV__: isDebug,
    }),

    // Do not create separate chunks of the server bundle
    // https://webpack.github.io/docs/list-of-plugins.html#limitchunkcountplugin
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),

    // Adds a banner to the top of each generated chunk
    // https://webpack.github.io/docs/list-of-plugins.html#bannerplugin
    new webpack.BannerPlugin('require("source-map-support").install();', { raw: true, entryOnly: false }),
  ],

  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },

  devtool: isDebug ? 'cheap-module-source-map' : 'source-map',
});

export default [clientConfig, serverConfig];
