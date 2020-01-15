const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

function tester (context, request, callback) {
  console.log('required: ', request, context);
  if (/(en|fr|it|nl)\/messages.js/.test(request)){
    return callback(null, 'commonjs ' + request);
  }
  callback();
};

const nextConfig = {
  webpack: (config, options) => {
    // if (Array.isArray(config.externals)) {
    //   config.externals.push(/(en|fr|it|nl)\/messages.js/i);
    // } 
    // else {
    //   config.externals = /(en|fr|it|nl)\/messages.js/i;
    // }
    config.module.rules.push({
      test: /locales\/*\.json/,
      use: [
        {
          loader: '@lingui/loader',
        },
      ],
    });
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);