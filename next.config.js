const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  webpack: (config, options) => {
    config.module.rules.push({
      test: /locales\/*\.json/,
      use: [
        {
          loader: '@lingui/loader',
        },
      ],
    })
    return config
  },
};

module.exports = withBundleAnalyzer(nextConfig);