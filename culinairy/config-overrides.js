const path = require('path');

module.exports = {
  webpack: (config, env) => {
    // Map incorrect absolute path to correct relative path
    config.resolve.extensions.push(".ts", ".tsx");
    config.resolve.alias['gpt-turbo$'] = path.resolve(__dirname, 'node_modules', 'gpt-turbo', 'dist', 'index.js');

    return config;
  },
};
