const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')([
  '@react-navigation/elements',
  '@react-navigation/native',
  '@react-navigation/native-stack',
  'react-native-safe-area-context'
]);

const nextConfig = {
  reactStrictMode: true,
  distDir: 'build/next',
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Transform all direct `react-native` imports to `react-native-web`
      'react-native$': 'react-native-web',
    }
    config.resolve.extensions = [
      '.web.js',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ]
    return config
  },
}

module.exports = withPlugins([withTM], nextConfig);
