const path = require('path'),
  packageName = require('../package.json').name;

const libPath = path.resolve(__dirname, './../lib'),
  settings = {
    mode: 'production',
    entry: './src/index.ts',
    module: {
      rules: [
        {
          test: /\.ts?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            configFile: path.resolve(__dirname, 'webpack.tsconfig.json')
          }
        }
      ]
    },
    resolve: {
      extensions: [ '.ts', '.js' ]
    }
  };

module.exports = [
  {
    ...settings,
    output: {
      filename: packageName + '.umd.js',
      path: libPath,
      libraryTarget: 'umd',
      globalObject: 'this'
    }
  },
  {
    ...settings,
    output: {
      filename: packageName + '.min.js',
      path: libPath,
      libraryTarget: 'umd',
      globalObject: 'this'
    },
    externals: {
      moment: 'moment'
    }
  }
];
