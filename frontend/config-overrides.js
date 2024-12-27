const { override, addWebpackAlias, addBabelPlugin } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    // Add any aliases you need here
    // e.g., '@components': path.resolve(__dirname, 'src/components')
  }),
  addBabelPlugin([
    '@babel/plugin-transform-runtime',
    {
      regenerator: true
    }
  ])
);